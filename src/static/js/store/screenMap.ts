import { defineStore } from "pinia";
interface ScreenMapState {
  parkId: string | number;
  buildingId: string | number;
  floorId: string | number;
  deviceId: string | number;
  systemId: string | number;
  subsystemId: string | number;
}
const useScreenMapStore = defineStore("screenMap", {
  state: (): ScreenMapState => ({
    parkId: "",
    buildingId: "",
    floorId: "",
    systemId: "",
    subsystemId: "",
    deviceId: "",
  }),
  getters: {
    getParkId: (state) => state.parkId,
    getBuildingId: (state) => state.buildingId,
    getFloorId: (state) => state.floorId,
    getSystemId: (state) => state.systemId,
    getSubsystemId: (state) => state.subsystemId,
    getDeviceId: (state) => state.deviceId,
  },
  actions: {
    setParkId(value: string | number) {
      this.parkId = value;
    },
    setBuildingId(value: string | number) {
      this.buildingId = value;
    },
    setFloorId(value: string | number) {
      this.floorId = value;
    },
    setSystemId(value: string | number) {
      this.systemId = value;
    },
    setSubsystemId(value: string | number) {
      this.subsystemId = value;
    },
    setDeviceId(value: string | number) {
      this.deviceId = value;
    },
  },
});
export default useScreenMapStore;
