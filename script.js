// A source URL is the only change needed to enable the demonstration video.
const video = document.querySelector("#model-video");
const videoSource = video?.querySelector("source")?.getAttribute("src")?.trim();

if (video && videoSource) {
  video.hidden = false;
  document.querySelector("#video-placeholder").hidden = true;
}

const copyButton = document.querySelector("#copy-citation");
const copyLabel = document.querySelector("#copy-label");
const copyStatus = document.querySelector("#copy-status");
let resetCopyLabel;

// The fallback also supports opening index.html directly from the filesystem.
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Try the selection-based fallback if clipboard permission is unavailable.
    }
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.cssText = "position:fixed;top:0;left:-9999px;";
  document.body.append(field);
  field.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  } finally {
    field.remove();
    copyButton.focus({ preventScroll: true });
  }
  return copied;
}

copyButton?.addEventListener("click", async () => {
  const citation = document.querySelector("#citation-text").textContent.trim();
  const copied = await copyText(citation);
  copyLabel.textContent = copied ? "Copied!" : "Select text";
  copyStatus.textContent = copied
    ? "BibTeX citation copied to clipboard."
    : "Copy was unavailable. Select and copy the citation text manually.";

  if (!copied) {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector("#citation-text"));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  clearTimeout(resetCopyLabel);
  resetCopyLabel = setTimeout(() => { copyLabel.textContent = "Copy"; }, 2500);
});
