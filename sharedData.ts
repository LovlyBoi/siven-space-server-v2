const matrixSab = new SharedArrayBuffer(
  Uint8Array.BYTES_PER_ELEMENT * 1024 * 1024 // 1MB
);

const usersSab = new SharedArrayBuffer(
  Uint8Array.BYTES_PER_ELEMENT * 1024 // 1K
);

const itemsSab = new SharedArrayBuffer(
  Uint8Array.BYTES_PER_ELEMENT * 1024 // 1K
);

const users = ["user1", "user2", "usr3"];
const items = ["item1", "item2", "itm3"];

let l = false;

function lock() {
  l = true;
}

function unLock() {
  l = false;
}

function sleep(time: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

async function waitLock(): Promise<void> {
  if (!l) {
    return;
  } else {
    await sleep(Math.random() + 0.5);
    return waitLock();
  }
}

// JSON化后放在共享内存中
export async function storeData<T = any>(
  sharedBuffer: Uint8Array,
  data: T
): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  await waitLock();
  lock();
  sharedBuffer.fill(0);
  sharedBuffer.set(encoder.encode(JSON.stringify(data)));
  unLock();
  return sharedBuffer;
}

export async function getData<T>(sharedBuffer: Uint8Array): Promise<T> {
  const decoder = new TextDecoder();
  await waitLock();
  lock();
  const data = JSON.parse(decoder.decode(sharedBuffer)) as T;
  unLock();
  return data;
}

export const matrix = new Uint8Array(matrixSab);
storeData(matrix, []);
export const userArr = new Uint8Array(usersSab);
storeData(userArr, users);
export const itemArr = new Uint8Array(itemsSab);
storeData(itemArr, items);
