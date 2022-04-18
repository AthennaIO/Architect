import { File, Path } from '@secjs/utils'
import { Architect } from 'src/Facades/Architect'

Architect.command('make:hello <name>', function (name: string) {
  new File(Path.pwd(`${name}.txt`), Buffer.from('Hello World!')).createSync()

  this.success('File successfully created!')
})
