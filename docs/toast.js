export { displayToast };

const displayToast = (el, message) => {
  el.MaterialSnackbar.showSnackbar({
    message: message,
    timeout: 3000
  });
};
