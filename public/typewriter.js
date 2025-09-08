const letter = document.getElementById('letter');
let index = 0;

const text =
`“Dear <player>,
One week from today, we are holding the Stardew Valley Fair in the town square!
It's the biggest event of the year, drawing people from all across the country to our humble town.
If you'd like, you can set up a grange display for the event. Just bring up to 9 items that best showcase your talents. You'll be judged on the quality and diversity of your display.
The fair starts at 9 AM... don't miss it!
-Mayor Lewis”`

function typeWriter() {
    if (index < text.length) {
        const char = text[index];
        letter.innerHTML += char === "\n" ? "<br>" : char;
        index++;
        setTimeout(typeWriter, 40)
    }
}

typeWriter();