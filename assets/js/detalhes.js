function dropdown(section, sectionIcon) {
    const div = document.getElementById(section);

    div.classList.toggle("open");

    if (div.classList.contains("open")) {
        document.getElementById(sectionIcon).className = 'fa-solid fa-chevron-up';
    }
    else {
        document.getElementById(sectionIcon).className = 'fa-solid fa-chevron-down';
    }
}