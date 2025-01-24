function loadAndMergeJson(requireContext, externalJson = []) {
    let idCounter = 1;
    const mergedList = [];

    // 加载默认表情
    requireContext.keys().forEach((key) => {
        const jsonData = requireContext(key);
        if (Array.isArray(jsonData)) {
            jsonData.forEach((item) => {
                mergedList.push({
                    ...item,
                    id: idCounter++,
                });
            });
        } else {
            console.warn(`File ${key} does not contain an array.`);
        }
    });

    // 合并外部 JSON 数据
    externalJson.forEach((item) => {
        mergedList.push({
            ...item,
            id: idCounter++,
        });
    });

    return mergedList;
}

function loadMemeJson(externalJson) {
    let idCounter = 1;
    const mergedList = [];

    // 合并外部 JSON 数据
    externalJson.forEach((item) => {
        mergedList.push({
            ...item,
            id: idCounter++,
        });
    });

    // 使用 flatMap 展平数组
    const flattenedList = mergedList.flatMap(item => item);

    return flattenedList;
}

// 加载默认表情
const jsonFiles = require.context('../characters', false, /\.json$/);

const allJson = loadAndMergeJson(jsonFiles);
export default allJson;

export { loadMemeJson };