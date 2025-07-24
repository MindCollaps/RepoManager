export function openInPopup(uri: string) {
    const name = 'popupWindow';
    const features = 'width=600,height=400,scrollbars=yes,resizable=yes';
    window.open(uri, name, features);
}
