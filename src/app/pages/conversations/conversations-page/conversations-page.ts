import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  IConversation,
  IConversationAttachment,
  IConversationMessage,
} from '../../../core/interface/IConversation';
import { ConversationUploadService } from '../../../core/service/conversation-upload.service';
import { ConversationsService } from '../../../core/service/conversations.service';

@Component({
  selector: 'app-conversations-page',
  standalone: false,
  templateUrl: './conversations-page.html',
  styleUrl: './conversations-page.scss',
})
export class ConversationsPage implements OnInit {
  private readonly conversationsService = inject(ConversationsService);
  private readonly uploadService = inject(ConversationUploadService);
  private readonly toastr = inject(ToastrService);

  @ViewChild('mediaInput') mediaInput?: ElementRef<HTMLInputElement>;
  @ViewChild('messagesPanel') messagesPanel?: ElementRef<HTMLDivElement>;

  readonly conversations = signal<IConversation[]>([]);
  readonly selectedConversation = signal<IConversation | null>(null);
  readonly isLoading = signal(false);
  readonly isUploading = signal(false);
  readonly isRecording = signal(false);

  messageText = '';
  selectedAttachment: IConversationAttachment | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  ngOnInit(): void {
    this.loadConversations();
  }

  selectConversation(conversation: IConversation): void {
    this.selectedConversation.set(conversation);
    this.scrollMessagesToBottom();
  }

  onSearch(term: string): void {
    const normalizedTerm = term.trim().toLowerCase();
    this.loadConversations(normalizedTerm);
  }

  async onMediaSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith('image/') &&
      !file.type.startsWith('video/') &&
      !file.type.startsWith('audio/')
    ) {
      this.toastr.error('اختار صورة أو فيديو أو صوت فقط');
      this.clearMediaInput();
      return;
    }

    await this.uploadAttachment(file);
    this.clearMediaInput();
  }

  async toggleRecording(): Promise<void> {
    if (this.isRecording()) {
      this.stopRecording();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      this.toastr.error('تسجيل الصوت غير متاح في هذا المتصفح');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: this.getSupportedAudioMimeType(),
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        this.handleRecordedAudio();
      };

      this.mediaRecorder.start();
      this.isRecording.set(true);
    } catch {
      this.toastr.error('لم نقدر نبدأ تسجيل الصوت');
    }
  }

  removeAttachment(): void {
    this.selectedAttachment = null;
  }

  sendMessage(): void {
    const conversation = this.selectedConversation();
    const text = this.messageText.trim();
    const attachments = this.selectedAttachment ? [this.selectedAttachment] : [];

    if (!conversation || (!text && !attachments.length)) {
      return;
    }

    this.isUploading.set(true);

    this.conversationsService.sendMessage(conversation, text, attachments).subscribe({
      next: (updatedConversation) => {
        this.messageText = '';
        this.selectedAttachment = null;
        this.selectedConversation.set(updatedConversation);
        this.upsertConversation(updatedConversation);
        this.scrollMessagesToBottom();

        this.isUploading.set(false);
      },
      error: () => {
        this.toastr.error('حدث خطأ أثناء إرسال الرسالة');
        this.isUploading.set(false);
      },
    });
  }

  getLastMessage(conversation: IConversation): string {
    const lastMessage = conversation.messages.at(-1);

    if (!lastMessage) {
      return 'لا توجد رسائل بعد';
    }

    if (lastMessage.text) {
      return lastMessage.text;
    }

    const attachment = lastMessage.attachments[0];
    return attachment ? this.getAttachmentLabel(attachment.type) : 'مرفق';
  }

  getAttachmentLabel(type: IConversationAttachment['type']): string {
    const labels: Record<IConversationAttachment['type'], string> = {
      image: 'صورة',
      video: 'فيديو',
      audio: 'رسالة صوتية',
    };

    return labels[type];
  }

  getMessageTime(message: IConversationMessage): string {
    return new Intl.DateTimeFormat('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(message.createdAt));
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  private loadConversations(searchTerm = ''): void {
    this.isLoading.set(true);

    this.conversationsService.loadAll().subscribe({
      next: (conversations) => {
        const filteredConversations = searchTerm
          ? conversations.filter((conversation) =>
            conversation.customerName.toLowerCase().includes(searchTerm) ||
            conversation.customerPhone.includes(searchTerm),
          )
          : conversations;

        this.conversations.set(this.sortConversations(filteredConversations));
        this.isLoading.set(false);
      },
      error: () => {
        this.toastr.error('حدث خطأ أثناء تحميل المحادثات');
        this.isLoading.set(false);
      },
    });
  }

  private async uploadAttachment(file: File): Promise<void> {
    this.isUploading.set(true);

    try {
      this.selectedAttachment = await this.uploadService.compressAndUpload(file);
      this.toastr.success('تم تجهيز المرفق للإرسال');
    } catch {
      this.toastr.error('حدث خطأ أثناء تجهيز المرفق');
    } finally {
      this.isUploading.set(false);
    }
  }

  private stopRecording(): void {
    this.mediaRecorder?.stop();
    this.isRecording.set(false);
  }

  private async handleRecordedAudio(): Promise<void> {
    if (!this.recordedChunks.length) {
      return;
    }

    const blob = new Blob(this.recordedChunks, {
      type: this.getSupportedAudioMimeType(),
    });
    const file = new File([blob], `voice-${Date.now()}.webm`, {
      type: blob.type,
    });

    await this.uploadAttachment(file);
  }

  private getSupportedAudioMimeType(): string {
    const webmType = 'audio/webm;codecs=opus';

    if (MediaRecorder.isTypeSupported(webmType)) {
      return webmType;
    }

    return 'audio/webm';
  }

  private upsertConversation(updatedConversation: IConversation): void {
    const nextConversations = this.conversations().filter(
      (conversation) => conversation.id !== updatedConversation.id,
    );

    this.conversations.set(this.sortConversations([
      updatedConversation,
      ...nextConversations,
    ]));
  }

  private sortConversations(conversations: IConversation[]): IConversation[] {
    return [...conversations].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  private clearMediaInput(): void {
    if (this.mediaInput) {
      this.mediaInput.nativeElement.value = '';
    }
  }

  private scrollMessagesToBottom(): void {
    setTimeout(() => {
      const panel = this.messagesPanel?.nativeElement;

      if (!panel) {
        return;
      }

      panel.scrollTo({
        top: panel.scrollHeight,
        behavior: 'smooth',
      });
    });
  }
}
