<#
    Purpose:
        Move changes on the official server from the Dev branch to the Default branch.
#>

function Set-ScriptVariables {
    $script:DebugPreference = "Continue"
    $Script:VerbosePreference = "Continue"
    # $script:DebugPreference = "SilentlyContinue"
    # $Script:VerbosePreference = "SilentlyContinue"

    $script:c_server_dev_path = "$env:USERPROFILE\AppData\Local\Screeps\scripts\screeps.com\dev"
    $script:c_server_qa_path = "$env:USERPROFILE\AppData\Local\Screeps\scripts\screeps.com\qa"

}

function Clear-OldFiles {
    Write-Host ("`nBegin - Clear-OldFiles")
    Remove-Item -Path $script:c_server_qa_path\*
    Write-Host ("End - Clear-OldFiles")
}

function Copy-DevToQa {
    Write-Host ("`nBegin - Copy-DevToQa")
    Copy-Item -Path $script:c_server_dev_path\* -Destination $script:c_server_qa_path -Recurse
    Write-Host ("End - Copy-DevToQa")
}

function Start-Main {

    Write-Host ("`nBegin - Start-Main")

    Set-ScriptVariables
    Clear-OldFiles
    Write-Host ("`nSleeping...")
    Start-Sleep 05
    Copy-DevToQa

    Write-Host ("End - Start-Main")
}

#Begin execution
Start-Main