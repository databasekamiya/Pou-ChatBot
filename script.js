const chatBox = document.getElementById("chatBox");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

let messages = [];

function addMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("message", sender);

    div.innerText = text;

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;

    return div;
}

function createTyping() {
    const div = document.createElement("div");
    div.classList.add("message", "bot");

    let dots = 0;
    div.innerText = "Pou sedang mengetik";

    const interval = setInterval(() => {
        dots = (dots + 1) % 4;
        div.innerText = "Pou sedang mengetik" + ".".repeat(dots);
    }, 400);

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;

    return { div, interval };
}

async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    messages.push({ role: "user", content: text });

    input.value = "";

    const typing = createTyping();

    try {
        const res = await fetch("https://zeppeliorg.jserver.web.id:2009/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ messages })
        });

        const data = await res.json();

        clearInterval(typing.interval);
        typing.div.remove();

        const reply = data?.choices?.[0]?.message?.content || "Tidak ada respon";

        addMessage(reply, "bot");

        messages.push({
            role: "assistant",
            content: reply
        });

    } catch (err) {
        clearInterval(typing.interval);
        typing.div.innerText = "Error koneksi ke server";
    }
}

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.onclick = sendMessage;
