import { fetchCodeFromUrl } from '../fetchCode';

test('Should succeed with a valid code url', async () => {
  const actual = await fetchCodeFromUrl("https://raw.githubusercontent.com/blended-zio/blended-zio/aa08573871c84dfddab3af88991ec01ed58c19bf/blended.zio.jmx/src/main/scala/blended/zio/jmx/JmxAttribute.scala")
  //const actual = await fetchCodeFromUrl("http://raw.doesnotexist.de/mycode.scala")
  console.log(actual)
  expect(actual.startsWith("package")).toBe(true)
})