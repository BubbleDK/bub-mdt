<img src="https://r2.fivemanage.com/s64hZD0G9WtYHbURWCuSc/5106eb971eee6ed4dd8d5e9196ccf9fe.png" alt="bub-mdt-image" />

You can watch a preview [here](https://streamable.com/m91u9u)

# Bubble MDT & Dispatch

<a href='https://ko-fi.com/bubbledk' target='_blank'><img height='35' style='border:0px;height:46px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' /><a/>

[Bubble Discord](https://discord.gg/KcahTuzNRh)

### ⚠️ Warning - This is still relatively untested, and bugs are likely to occur.

A police MDT with built-in dispatch functionalities. The MDT consists of the following pages:

- Dashboard
- Profiles
- Incidents
- Reports
- Vehicles
- Dispatch
- Roster
- Charges

# Frameworks

- [qbx_core](https://github.com/Qbox-project/qbx_core)
- [qb_core](https://github.com/qbcore-framework/qb-core)

# Dependencies

- [oxmysql](https://github.com/overextended/oxmysql)
- [ox_lib](https://github.com/overextended/ox_lib)

# Installation

- Install all the dependencies and have them started before bub-mdt
- Import the SQL provided
- Drag and drop the resource into your resources folder
- Add `start bub-mdt` to your `server.cfg` file

# Credits

Without the creation of the following resources, this MDT would not have seen the light of day, as this MDT is heavily inspired by these:

- [ox_mdt](https://github.com/overextended/ox_mdt) - Dispatch, Some events and function, Code structure and data flow

# Feature Request, Issue Reporting & Contribution

- Contributions are always welcome - Open a pull request.
- Found a bug? Open an issue.
- Want a feature implemented? Open an issue.

# The resource state

- LUA part needs some refactoring.
- A lot of the UI needs to be refactored, more modular and simply be optimized.
- The drivers license points system needs to be revamped, as of right now it does not function properly.
- Probably a lot more which i have forgotten about, but i guess it will get mentioned if people end up using this MDT.

# Dispatch usage example

## Custom alert example

```lua
exports['bub-mdt']:CustomAlert({
    coords = vec3(0, 0, 0),
    info = {
        {
            label = 'A custom disptach alert',
            icon = 'gender-bigender',
        },
    },
    code = '10-90',
    offense = 'A cool offense',
    blip = 310,
})
```

## Pre configured alert examples

```lua
exports['bub-mdt']:Shooting()
exports['bub-mdt']:VehicleShooting()
exports['bub-mdt']:OfficerDown()
```
