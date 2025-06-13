async function submitForm() {
  const formData = {
    name: `${document.getElementById("firstname").value} ${document.getElementById("middlename").value} ${document.getElementById("lastname").value}`,
    email: document.getElementById("email").value,
    contact: document.getElementById("contact").value,
    dob: document.getElementById("dob").value,
    idNumber: document.getElementById("idNumber").value,
    imageBase64: await getImageBase64()
  };

  const response = await fetch('https://script.google.com/macros/s/AKfycbxYBgaLZm6qNFKE4JgveZFaY73gX6LWTIVTsPDLLXbc70-fw1-iBnyj5Rw7yfqhII6n/exec', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const result = await response.json();

  document.getElementById("result").innerHTML = result.message;

  if (result.verified && result.link) {
    document.getElementById("whatsapp-link").innerHTML =
      `<a href="${result.link}" target="_blank">✅ Join WhatsApp Group</a>`;
  } else {
    document.getElementById("whatsapp-link").innerHTML = '';
  }
}

async function getImageBase64() {
  const file = document.getElementById('idImage').files[0];
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

document.querySelector("form").addEventListener("submit", async function(e) {
    e.preventDefault();
    await submitForm();
  });