import { fetchCodeFromFile, fetchCodeFromUrl } from '../fetchCode';

describe('Fetch Code', () => {

  test('Should succeed with a valid code url', async () => {
    const actual = await fetchCodeFromUrl("https://raw.githubusercontent.com/blended-zio/blended-zio/aa08573871c84dfddab3af88991ec01ed58c19bf/blended.zio.jmx/src/main/scala/blended/zio/jmx/JmxAttribute.scala")
    expect(actual[0].startsWith("package")).toBe(true)
  })

  test('Should succeed getting a file from the file system (relative)', () => {
    const actual = fetchCodeFromFile("src/transform.ts")
    expect(actual[0].startsWith("import visit")).toBe(true)
  })

  test('Should succeed getting a file from the file system (absolute)', () => {
    const actual = fetchCodeFromFile(process.cwd() + "/src/transform.ts")
    expect(actual[0].startsWith("import visit")).toBe(true)
  })

})
