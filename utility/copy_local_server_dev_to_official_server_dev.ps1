## Adding this script to move changes that I make while doing local development to the dev
## folder of the Official Server.


$local_dev_path = "$env:USERPROFILE\AppData\Local\Screeps\scripts\127_0_0_1___21025\dev_local\*"
$server_dev_path = "$env:USERPROFILE\AppData\Local\Screeps\scripts\screeps.com\dev"

Remove-Item -Path $server_dev_path\* -WhatIf
Copy-Item -Path $local_dev_path -Destination $server_dev_path -Recurse -WhatIf 