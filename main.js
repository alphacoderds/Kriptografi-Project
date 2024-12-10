document.getElementById("encryption-form").addEventListener("submit", function (event) {
  event.preventDefault();

  // Ambil input pengguna
  const plaintext = document.getElementById("plaintext").value;
  const key = document.getElementById("key").value;

  if (!plaintext || !key) {
    Swal.fire("Error", "Harap isi semua kolom!", "error");
    return;
  }

  // Lapisan 1: Caesar Cipher
  const caesarCipher = (text, shift) =>
    text
      .split("")
      .map(char => String.fromCharCode((char.charCodeAt(0) + shift) % 256))
      .join("");

  const caesarDecrypt = (text, shift) =>
    text
      .split("")
      .map(char => String.fromCharCode((char.charCodeAt(0) - shift + 256) % 256))
      .join("");

  const caesarShift = 3;
  let encrypted = caesarCipher(plaintext, caesarShift);

  // Lapisan 2: Vigenere Cipher
  const vigenereCipher = (text, key) =>
    text
      .split("")
      .map((char, i) =>
        String.fromCharCode((char.charCodeAt(0) + key.charCodeAt(i % key.length)) % 256)
      )
      .join("");

  const vigenereDecrypt = (text, key) =>
    text
      .split("")
      .map((char, i) =>
        String.fromCharCode(
          (char.charCodeAt(0) - key.charCodeAt(i % key.length) + 256) % 256
        )
      )
      .join("");

  encrypted = vigenereCipher(encrypted, key);

  // Lapisan 3: Block Cipher CBC (AES)
  const aesEncrypt = (text, key) => {
    const aesKey = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.enc.Utf8.parse("1234567890123456");
    const encrypted = CryptoJS.AES.encrypt(text, aesKey, { iv: iv, mode: CryptoJS.mode.CBC });
    return encrypted.toString();
  };

  const aesDecrypt = (text, key) => {
    const aesKey = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.enc.Utf8.parse("1234567890123456");
    const decrypted = CryptoJS.AES.decrypt(text, aesKey, { iv: iv, mode: CryptoJS.mode.CBC });
    return CryptoJS.enc.Utf8.stringify(decrypted);
  };

  encrypted = aesEncrypt(encrypted, key);

  // Lapisan 4: Stream Cipher (RC4)
  const streamEncrypt = (text, key) => {
    const streamKey = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.RC4.encrypt(text, streamKey);
    return encrypted.toString();
  };

  const streamDecrypt = (text, key) => {
    const streamKey = CryptoJS.enc.Utf8.parse(key);
    const decrypted = CryptoJS.RC4.decrypt(text, streamKey);
    return CryptoJS.enc.Utf8.stringify(decrypted);
  };

  encrypted = streamEncrypt(encrypted, key);

  // Lapisan 5: Pseudo Serpent
  const serpentEncrypt = (text, key) => {
    const combinedKey = key.repeat(16).slice(0, 16); // Simulasi key padding
    const serpentKey = CryptoJS.enc.Utf8.parse(combinedKey);
    const iv = CryptoJS.enc.Utf8.parse("1234567890123456");
    const encrypted = CryptoJS.AES.encrypt(text, serpentKey, { iv: iv, mode: CryptoJS.mode.ECB }); // Simulasi ECB
    return encrypted.toString();
  };

  const serpentDecrypt = (text, key) => {
    const combinedKey = key.repeat(16).slice(0, 16); // Simulasi key padding
    const serpentKey = CryptoJS.enc.Utf8.parse(combinedKey);
    const iv = CryptoJS.enc.Utf8.parse("1234567890123456");
    const decrypted = CryptoJS.AES.decrypt(text, serpentKey, { iv: iv, mode: CryptoJS.mode.ECB });
    return CryptoJS.enc.Utf8.stringify(decrypted);
  };

  encrypted = serpentEncrypt(encrypted, key);

  // Tampilkan hasil enkripsi
  Swal.fire({
    title: "Hasil Enkripsi",
    html: `<strong>Encrypted:</strong> ${encrypted}`,
    icon: "success",
    confirmButtonText: "Lanjut Dekripsi",
  }).then(() => {
    // Dekripsi (Serpent ➡️ RC4 ➡️ CBC ➡️ Vigenere ➡️ Caesar)
    let decrypted = serpentDecrypt(encrypted, key);
    decrypted = streamDecrypt(decrypted, key);
    decrypted = aesDecrypt(decrypted, key);
    decrypted = vigenereDecrypt(decrypted, key);
    decrypted = caesarDecrypt(decrypted, caesarShift);

    Swal.fire({
      title: "Hasil Dekripsi",
      html: `<strong>Decrypted:</strong> ${decrypted}`,
      icon: "info",
      confirmButtonText: "Selesai",
    });
  });
});