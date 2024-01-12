export function getNameFromPath(path) {
  const splitPath = path.split('/');
  return splitPath[splitPath.length - 1];
}
