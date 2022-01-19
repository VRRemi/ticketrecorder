function RandomString(length) {
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];
    for (var i = 0; i < length; i++) {
        var j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

const markdown = (text) => {
    let markdown_strs = [
        {
            mark: "```",
            style: "p-6 6 bg-primary-300 rounded-md text-gray-200 mt-2 md:mr-5 whitespace-pre-line",
            tag: "p"
        },
        {
            mark: "**",
            style: "font-bold text-white",
            tag: "b"
        },
        {
            mark: "``",
            style: "bg-gray-900 font-normal text-white-300 rounded-sm px-1",
            tag: "b"
        },
        {
            mark: "`",
            style: "bg-gray-900 font-normal text-white-300 rounded-sm px-1",
            tag: "b"
        },
        {
            mark: "__",
            style: "underline text-white",
            tag: "b"
        },
        {
            mark: "*",
            style: "italic text-white",
            tag: "b"
        },
        {
            mark: "~~",
            style: "line-through text-white",
            tag: "b"
        },
        {
            mark: "||",
            style: "bg-gray-700 duration-300 ease-in text-white px-1 rounded-sm",
            tag: "b"
        }
    ]
    markdown_strs.map(md => {
        text?.split(md.mark).filter(e => e !== "" && e !== " ").map(str => {
            text = text?.replace(md.mark + str + md.mark, `<${md.tag} class="${md.style}">${str}</${md.tag}>`)
        })
    })
    return text;
}