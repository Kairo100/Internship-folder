export const maskAccNo = (accNo: any) => {
  return accNo.replace(/.(?=.{4})/g, '*'); // Mask all characters except the last four
};

export const isValidBase64Image = async (buffer) => {
  const jpegMagicNumber = Buffer.from([0xff, 0xd8, 0xff]);
  const pngMagicNumber = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);
  const gifMagicNumber = Buffer.from([0x47, 0x49, 0x46, 0x38]);

  if (buffer.slice(0, 3).equals(jpegMagicNumber)) {
    return true; // JPEG
  } else if (buffer.slice(0, 8).equals(pngMagicNumber)) {
    return true; // PNG
  } else if (buffer.slice(0, 4).equals(gifMagicNumber)) {
    return true; // GIF
  }

  return false;
};
