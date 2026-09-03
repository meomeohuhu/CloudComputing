import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export async function captureInspectionPhoto(): Promise<string | null> {
  try {
    const image = await Camera.getPhoto({
      quality: 75,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    return image.dataUrl ?? null;
  } catch {
    return null;
  }
}
