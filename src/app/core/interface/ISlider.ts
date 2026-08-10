import { SliderDisplayLocation } from "../enum/SliderDisplayLocation";

export interface ISlider {
    id: string;
    title?: string;
    imageUrl: string;
    date: string;
    isActive: boolean;
    displayLocation: SliderDisplayLocation;
}
