export function downloadFromBlob(blob: Blob, filename: string) {
  let a = document.createElement("a");
  document.body.appendChild(a);

  a.setAttribute("style", "display: none");

  const url = window.URL.createObjectURL(blob);

  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

export function dataUrlFromBlob(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();

    const onerror = (_e: ProgressEvent<FileReader>, aborted: boolean) => {
      console.error(
        _e.target?.error ?? new Error(aborted ? "Aborted!" : "Could not load.")
      );
      resolve("");
    };

    fr.onload = (ev) => resolve(fr.result as string);
    fr.onerror = (ev) => onerror(ev, false);
    fr.onabort = (ev) => onerror(ev, true);

    fr.readAsDataURL(blob);
  });
}

export function getTextBlobFromString(string: string) {
  return new Blob([string], {
    type: "text/plain",
  });
}
