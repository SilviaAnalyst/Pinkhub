const form = document.getElementById("regForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "Submitting...";

    const formData = new FormData(form);
    const imageFile = formData.get("idImage");

    // Convert image to Base64
    const reader = new FileReader();
    reader.onloadend = async function () {
      const base64Image = reader.result.split(",")[1]; // strip data:image/...;base64,

      const payload = {
        firstname: formData.get("firstname"),
        middlename: formData.get("middlename"),
        lastname: formData.get("lastname"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        dob: formData.get("dob"),
        idnumber: formData.get("idnumber"),
        image: base64Image,
        filename: imageFile.name
      };

      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwUsnH8Pp2toZJUxIct-HgVZ60YyYRUV8WVrud5u7gDpP533d0eLyQEfUgeKRgeMWoJ/exec", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" }
        });

        const result = await response.json();
        if (result.status === "success") {
          resultDiv.innerHTML = `<p>Form submitted successfully. Age: ${result.age}</p>`;
        } else {
          resultDiv.innerHTML = `<p>Error: ${result.message}</p>`;
        }
      } catch (err) {
        resultDiv.innerHTML = `<p>Failed to submit: ${err}</p>`;
      }
    };

    reader.readAsDataURL(imageFile);
  });