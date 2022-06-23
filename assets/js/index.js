const inputFile = document.getElementById('screenshot');
const btnConfirm = document.getElementById('btn-confirm');
const btnSubmit = document.getElementById('btn-submit');

btnConfirm.addEventListener('click', submitForm);

function showImage() {
  if (event.target.files.length > 0) {
    if (event.target.files[0].size > 2097152) {
      alert('Ukuran file melebihi batas maksimum!');
      event.target.value = '';
    }

    const filePath = URL.createObjectURL(event.target.files[0]);

    const imgPreview = document.getElementById('img-preview');
    const caption = document.getElementById('caption');
    
    inputFile.style.height = '0';
    
    imgPreview.src = filePath;
    imgPreview.style.display = 'block';
    imgPreview.onclick = () => {
      inputFile.click();
    };
    
    caption.style.display = 'none';
  }
}

function submitForm(event) {
  event.preventDefault();

  Swal.fire({
    title: 'Apakah kamu sudah yakin?',
    text: "Pastikan data yang kamu inputkan sudah benar!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DE754C',
    cancelButtonColor: '#9E2A2B',
    confirmButtonText: 'Ya, saya sudah yakin!'
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
    btnConfirm.removeAttribute('disabled')
  }
}
