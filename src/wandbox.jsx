export default async function getCompilerInfo() {
  return fetch('https://wandbox.org/api/list.json')
  .then(response => response.json())
  .then(list => {
    const [languageCompilerMap, compilerOptionsMap] = [{'': []}, {'': []}]
    for(const item of list) {
      if(item.language in languageCompilerMap) {
        languageCompilerMap[item.language].push(item.name)
      } else {
        languageCompilerMap[item.language] = [item.name]
      }
      compilerOptionsMap[item.name] = item.switches
    }
    return {
      'languageCompilerMap': languageCompilerMap,
      'compilerOptionsMap': compilerOptionsMap
    };
  })
}