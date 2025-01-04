function loadAndMergeJson(requireContext) {
    let idCounter = 1; // 用于生成全局唯一 ID
    const mergedList = []; // 用于存储合并后的结果

    requireContext.keys().forEach((key) => {
        const jsonData = requireContext(key); // 动态加载 JSON

        // 检查数据是否为数组
        if (Array.isArray(jsonData)) {
            // 遍历数组，为每个对象添加唯一 ID
            jsonData.forEach((item) => {
                mergedList.push({
                    ...item, // 原对象内容
                    id: idCounter++, // 唯一 ID
                });
            });
        } else {
            console.warn(`File ${key} does not contain an array.`);
        }
    });

    return mergedList;
}

// 加载文件夹中的所有 JSON 文件
const jsonFiles = require.context('../characters', false, /\.json$/);
const allJson = loadAndMergeJson(jsonFiles);

export default allJson;
