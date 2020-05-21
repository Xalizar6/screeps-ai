<#
    Purpose:
        Move changes on the official server from the QA branch to the Default branch.
#>

function Set-ScriptVariables {
    $script:DebugPreference = "Continue"
    $Script:VerbosePreference = "Continue"
    # $script:DebugPreference = "SilentlyContinue"
    # $Script:VerbosePreference = "SilentlyContinue"

    $script:c_server_qa_path = "$env:USERPROFILE\AppData\Local\Screeps\scripts\screeps.com\qa"
    $script:c_server_default_path = "$env:USERPROFILE\AppData\Local\Screeps\scripts\screeps.com\default"

}

function Clear-OldFiles {
    Write-Host ("`nBegin - Clear-OldFiles")
    Remove-Item -Path $script:c_server_default_path\*
    Write-Host ("End - Clear-OldFiles")
}

function Copy-QaToDefault {
    Write-Host ("`nBegin - Copy-QaToDefault")
    Copy-Item -Path $script:c_server_qa_path\* -Destination $script:c_server_default_path -Recurse
    Write-Host ("End - Copy-QaToDefault")
}

function Start-Main {

    Write-Host ("`nBegin - Start-Main")

    Set-ScriptVariables
    Clear-OldFiles
    Write-Host ("`nSleeping...")
    Start-Sleep 05
    Copy-QaToDefault

    Write-Host ("End - Start-Main")
}

#Begin execution
Start-Main