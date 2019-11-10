<#
    Purpose:
        Move changes on the dev_local branch to the dev branch on the official server.
#>
function Set-ScriptVariables {
    $script:DebugPreference = "Continue"
    $Script:VerbosePreference = "Continue"
    # $script:DebugPreference = "SilentlyContinue"
    # $Script:VerbosePreference = "SilentlyContinue"

    $script:local_dev_path = "$env:USERPROFILE\AppData\Local\Screeps\scripts\127_0_0_1___21025\dev_local"
    $script:server_dev_path = "$env:USERPROFILE\AppData\Local\Screeps\scripts\screeps.com\dev"
}

function Clear-OldFiles {
    Write-Host ("`nBegin - Clear-OldFiles")
    Remove-Item -Path $server_dev_path\*
    Write-Host ("End - Clear-OldFiles")
}

function Copy-LocalDevToServerDev {
    Write-Host ("`nBegin - Copy-LocalDevToServerDev")
    Copy-Item -Path $local_dev_path\* -Destination $server_dev_path -Recurse
    Write-Host ("End - Copy-LocalDevToServerDev")
}

function Start-Main {

    Write-Host ("`nBegin - Start-Main")

    Set-ScriptVariables
    Clear-OldFiles
    Write-Host ("`nSleeping...")
    Start-Sleep 05
    Copy-LocalDevToServerDev

    Write-Host ("End - Start-Main")
}

#Begin execution
Start-Main