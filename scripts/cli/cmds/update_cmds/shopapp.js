exports.command = 'shopapp <file>'
exports.desc = 'Update shopapp <file>'
exports.builder = function (yargs) {
  return yargs.commandDir('shopapp_cmds')
}
exports.handler = function (argv) {}