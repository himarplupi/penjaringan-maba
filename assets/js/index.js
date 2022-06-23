const inputFile = document.getElementById('screenshot');
const imgPreview = document.getElementById('img-preview');
const caption = document.getElementById('caption');

const btnConfirm = document.getElementById('btn-confirm');
const btnSubmit = document.getElementById('btn-submit');
const btnRemoveImg = document.getElementById('btn-remove');

btnConfirm.addEventListener('click', submitForm);
btnRemoveImg.addEventListener('click', removePreview);

function showImage() {
  if (event.target.files.length > 0) {
    if (event.target.files[0].size > 2097152) {
      Swal.fire({
        text: 'Ukuran gambar tidak boleh lebih dari 2mb!',
        icon: 'warning',
        confirmButtonColor: '#DE754C',
        confirmButtonText: 'Ok',
      });
      event.target.value = '';
    }

    const filePath = URL.createObjectURL(event.target.files[0]);

    inputFile.style.height = '0';
    
    imgPreview.src = filePath;
    imgPreview.alt = 'Image Upload';
    imgPreview.style.display = 'block';
    imgPreview.onclick = () => {
      inputFile.click();
    };

    caption.style.display = 'none';
    btnRemoveImg.style.display = 'block';
  }
}

function removePreview(event) {
  event.preventDefault();
  imgPreview.src = '';
  imgPreview.alt = '';
  inputFile.value = '';

  btnRemoveImg.style.display = 'none';
  caption.style.display = 'block';
  inputFile.style.height = '100%';
}

function submitForm(event) {
  event.preventDefault();

  Swal.fire({
    title: 'Apakah kamu sudah yakin?',
    text: 'Pastikan data yang kamu inputkan sudah benar!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DE754C',
    cancelButtonColor: '#9E2A2B',
    confirmButtonText: 'Ya, saya sudah yakin!',
  }).then((result) => {
    if (result.isConfirmed) {
      btnSubmit.click();
    }
  });
}

function validateForm(elm) {
  const nama = elm.querySelector('#nama').value;
  const sekolah = elm.querySelector('#sekolah').value;
  const telp = elm.querySelector('#telp').value;
  const image = inputFile.value;

  btnConfirm.setAttribute('disabled', true);

  if (nama && sekolah && telp && image) {
    btnConfirm.removeAttribute('disabled');
  }
}
