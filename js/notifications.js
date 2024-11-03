function swalMixinInfo() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "info",
    title: "Field reset!",
  });
}

function swalQuestionDelete(event) {
  event.preventDefault();
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this entry?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel",
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      event.target.submit();
    }
  });
}

$(document).ready(() => {
  $(".sp-reset").click(function (e) {
    swalMixinInfo();
  });

  $(".sp-form-verify").on("submit", swalQuestionDelete);
});