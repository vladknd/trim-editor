export const trim = async (inputFile, end, duration, outputFileName) => {
    const { name } = inputFile;
    // it will download ~25Mb
    await ffmpeg.load();
    await ffmpeg.write(name, inputFile);
    await ffmpeg.run(getMp4Command(name, end, duration, outputFileName));
    // get output
    const output = ffmpeg.read(outputFileName);
    // it will returns a proper url for <video /> tag's src attribute. you can change it to anything you want
    return URL.createObjectURL(new Blob([output.buffer], { type: 'video/mp4' }))
}

const getMp4Command = (input, end, duration, output) => `-t ${end} -i ${input} -ss ${duration} ${output}`