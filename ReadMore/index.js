document.getElementById("read").addEventListener("click", function() {
    var hide = document.getElementById("hide");
    var read = document.getElementById("read");

    if (hide.classList.contains("show")) {
        hide.classList.remove("show");
        hide.style.maxHeight = "0";
        read.textContent = "Read more";
    } else {
        hide.classList.add("show");
        hide.style.maxHeight = hide.scrollHeight + "px";
        read.textContent = "Read less";
    }
});
