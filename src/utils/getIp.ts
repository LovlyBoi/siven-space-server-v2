import os from "os";

interface NetWorkIp {
  local: string;
  network: string;
}

export let network: NetWorkIp = { local: "", network: "" };

Object.values(os.networkInterfaces()).forEach((item) => {
  item?.forEach((obj) => {
    if (
      obj.family === "IPv4" &&
      obj.mac !== "00:00:00:00:00:00" &&
      obj.address !== "127.0.0.1"
    ) {
      network.local = "localhost";
      network.network = obj.address;
    }
  });
});
