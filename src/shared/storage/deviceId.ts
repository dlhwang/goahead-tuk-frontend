const DEVICE_ID_KEY = 'goahead-tuk.device-id';

export function getDeviceId(): string {
  const savedDeviceId = window.localStorage.getItem(DEVICE_ID_KEY);

  if (savedDeviceId) {
    return savedDeviceId;
  }

  const deviceId = crypto.randomUUID();
  window.localStorage.setItem(DEVICE_ID_KEY, deviceId);

  return deviceId;
}
