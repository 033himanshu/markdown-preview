const input = document.querySelector('.input')
const preview = document.querySelector('.preview')



let timeoutId=null
input.addEventListener('input', ()=>{
    clearTimeout(timeoutId)
    timeoutId = setTimeout(parseText,1*1000)
})

function escapeHTML(str) {
    return str.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
const parseText = ()=>{
    let res = input.value;
    res = res.replace(/^###### (.*$)/gm, '<h6>$1</h6><hr>');
    res = res.replace(/^##### (.*$)/gm, '<h5>$1</h5><hr>');
    res = res.replace(/^#### (.*$)/gm, '<h4>$1</h4><hr>');
    res = res.replace(/^### (.*$)/gm, '<h3>$1</h3><hr>');
    res = res.replace(/^## (.*$)/gm, '<h2>$1</h2><hr>');
    res = res.replace(/^# (.*$)/gm, '<h1>$1</h1><hr>');
    
    
    // Convert bold, italic, strikethrough, underline
    res = res.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Bold **text**
    res = res.replace(/\*(.*?)\*/g, '<i>$1</i>');     // Italic *text*
    res = res.replace(/~~(.*?)~~/g, '<s>$1</s>');     // Italic *text*
    res = res.replace(/__(.*?)__/g, '<u>$1</u>');     // Italic *text*
    
    
    // Convert images
    res = res.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1"/>');

    // Convert links
    res = res.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    
    // Convert code block
    res = res.replace(/```(\w+)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `\n<div class="code">\n
        <div class="title">${lang}</div>\n
        <pre>${escapeHTML(code)}</pre>\n
        </div>\n`;
    })
    
    // convert ordered lists (1. item)
    res = res.replace(/(?:^|\n)(\d. .*(?:\n\d. .*)*)/g, (match) => {
        const items = match.trim().split("\n").map(item => `<li>${item.substring(2)}</li>`).join("\n");
        return `\n<ol>\n${items}\n</ol>\n`;
    });
    
    res = res.replace(/(?:^|\n)(- .*(?:\n- .*)*)/g, (match) => {
        const items = match.trim().split("\n").map(item => `<li>${item.substring(2)}</li>`).join("\n");
        return `\n<ul>\n${items}\n</ul>\n`;
    });
    preview.innerHTML = res;
}





document.querySelector('.reset').addEventListener('click',()=>{
    input.value = ""
    preview.innerHTML = ""
})

document.querySelector('.download').addEventListener('click',async function () {
    const filename = 'markdown.pdf';
    try {
        const opt = {
            margin: 1,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: {
                unit: 'in', format: 'letter',
                orientation: 'portrait'
            }
        };
        await html2pdf().set(opt).
            from(preview).save();
    } catch (error) {
        console.error('Error:', error.message);
    }
})