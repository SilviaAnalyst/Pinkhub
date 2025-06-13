const form = document.getElementById("regForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const resultDiv = document.getElementById("result");
  const linkDiv = document.getElementById("whatsapp-link");

  resultDiv.innerHTML = "Submitting...";
  linkDiv.innerHTML = ""; // Clear previous link or message

  const formData = new FormData(form);
  const imageFile = formData.get("idImage");

  const reader = new FileReader();
  reader.onloadend = async function () {
    const base64Image = reader.result.split(",")[1]; // Remove data prefix

    const payload = new URLSearchParams();
    payload.append("firstname", formData.get("firstname"));
    payload.append("middlename", formData.get("middlename"));
    payload.append("lastname", formData.get("lastname"));
    payload.append("email", formData.get("email"));
    payload.append("phone", formData.get("phone"));
    payload.append("dob", formData.get("dob"));
    payload.append("idnumber", formData.get("idnumber"));
    payload.append("filename", imageFile.name);
    payload.append("image", base64Image);

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwUsnH8Pp2toZJUxIct-HgVZ60YyYRUV8WVrud5u7gDpP533d0eLyQEfUgeKRgeMWoJ/exec", {
        method: "POST",
        body: payload
      });

      const result = await response.json();

      if (result.status === "success") {
        resultDiv.innerHTML = `<p>Form submitted successfully. You are ${result.age} years old.</p>`;

        // Clear the form fields
        form.reset();

        if (result.isOfAge) {
          const joinBtn = document.createElement("button");
          joinBtn.textContent = "Join WhatsApp Group";
          joinBtn.style.padding = "10px 20px";
          joinBtn.style.backgroundColor = "#25D366";
          joinBtn.style.color = "white";
          joinBtn.style.border = "none";
          joinBtn.style.borderRadius = "5px";
          joinBtn.style.cursor = "pointer";

          joinBtn.onclick = () => {
            if (confirm("You're verified. Join the WhatsApp group now?")) {
              window.location.href = "https://chat.whatsapp.com/YOUR-SECRET-GROUP-LINK";
            }
          };

          linkDiv.appendChild(joinBtn);
        } else {
          linkDiv.innerHTML = "<p style='color:red;'>You are not eligible to join the WhatsApp group.</p>";
        }

      } else {
        resultDiv.innerHTML = `<p>Error: ${result.message}</p>`;
      }

    } catch (err) {
      resultDiv.innerHTML = `<p>Submission failed: ${err.message}</p>`;
    }
  };

  reader.readAsDataURL(imageFile);
});
