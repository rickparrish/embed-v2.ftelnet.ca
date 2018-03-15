var SnippetDiv = '';
var SnippetScriptfTelnet = '';
var SnippetScriptOptions = '';
var SplashScreen = '';

$(document).ready(function () {
    // Update, just in case they refreshed while on the wizard page
    Update();
});

var CheckBoxes = '#chkUniqueIds';
$(CheckBoxes).click(function () {
    Update();
});

var ComboBoxes = '#cboAutoConnect, #cboBareLFtoCRLF, #cboBitsPerSecond, #cboConnectionType, #cboEmulation, #cboEnter, #cboFileTransfer, #cboFont, #cboForceWss, #cboProxyServer, #cboVirtualKeyboardVisible';
$(ComboBoxes).change(function () {
    Update();
});

var FileUpload = '#fuSplashScreen';
$(FileUpload).change(function () {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('The File APIs are not fully supported in this browser, so you\'ll have to set the SplashScreen manually.');
      return;
    }   

    var fuSplashScreen = document.getElementById('fuSplashScreen');
    if (!fuSplashScreen.files) {
      alert('This browser doesn\'t seem to support the `files` property of file inputs, so you\'ll have to set the SplashScreen manually.');
    } else {
      var UploadedFile = fuSplashScreen.files[0];
      var FR = new FileReader();
      FR.onload = function() {
          SplashScreen = FR.result.split('base64,')[1];
          Update();
      };
      FR.readAsDataURL(UploadedFile);
    }    
});

var TextBoxes = '#txtHostname, #txtPort, #txtRLoginClientUsername, #txtRLoginServerUsername, #txtRLoginTerminalType, #txtScreenColumns, #txtScreenRows';
$(TextBoxes).keyup(function () {
    Update();
});

function Update() {
    // Update visibility of RLogin settings
    if ($('#cboAutoConnect').val() === 'true') {
        $('#pnlSplashScreen').addClass('hidden');
    } else {
        $('#pnlSplashScreen').removeClass('hidden');
    }

    // Update visibility of RLogin settings
    if ($('#cboConnectionType').val() === 'rlogin') {
        $('#pnlRLogin').removeClass('hidden');
    } else {
        $('#pnlRLogin').addClass('hidden');
    }

    // Update label on hostname and port fields
    if ($('#cboProxyServer').val() === 'none') {
        $('#lblPortType1').text('proxy');
        $('#lblPortType2').text('proxy');
    } else {
        $('#lblPortType1').text($('#cboConnectionType').val());
        $('#lblPortType2').text($('#cboConnectionType').val());
    }

    // Update visibility of ansi-bbs related settings
    if ($('#cboEmulation').val() === 'ansi-bbs') {
        $('#pnlAnsiBBS').removeClass('hidden');
    } else {
        $('#pnlAnsiBBS').addClass('hidden');
    }
    
    // Clean up the hostname in case someone copy/pastes it in there with extra spaces
    $('#txtHostname').val($.trim($('#txtHostname').val()));
   
    // Ensure we have a hostname
    if ($('#txtHostname').val() == '') {
        $('#pnlSnippet').addClass('hidden');
        return;
    } else {
        $('#pnlSnippet').removeClass('hidden');
    }

    // Get a unique client id, if necessary
    var ClientId = '';
    if ($('#chkUniqueIds').is(':checked')) {
        ClientId = '_' + $('#txtHostname').val().replace(/[.-]/g, '_') + '_' + $('#txtPort').val();
    }
    
    // Check RIP and XFER support
    var RIP = $('#cboEmulation').val() === 'RIP' ? 'rip' : 'norip';
    var XFER = $('#cboFileTransfer').val() === 'true' ? 'xfer' : 'noxfer';
    
    // Build the snippet
    SnippetDiv = '<div id="fTelnetContainer' + ClientId + '" class="fTelnetContainer"></div>\r\n';
    SnippetScriptfTelnet = '<script>document.write(\'<script src="//embed-v2.ftelnet.ca/js/ftelnet-loader.' + RIP + '.' + XFER + '.js?v=\' + (new Date()).getTime() + \'"><\\/script>\');</script>\r\n';
    SnippetScriptOptions = '    var Options' + ClientId + ' = new fTelnetOptions();\r\n';
    SnippetScriptOptions += '    Options' + ClientId + '.BareLFtoCRLF = ' + $('#cboBareLFtoCRLF').val() + ';\r\n';
    SnippetScriptOptions += '    Options' + ClientId + '.BitsPerSecond = ' + $('#cboBitsPerSecond').val() + ';\r\n';
    SnippetScriptOptions += '    Options' + ClientId + '.ConnectionType = \'' + $('#cboConnectionType').val() + '\';\r\n';
    SnippetScriptOptions += '    Options' + ClientId + '.Emulation = \'' + $('#cboEmulation').val() + '\';\r\n';
    SnippetScriptOptions += '    Options' + ClientId + '.Enter = \'' + $('#cboEnter').val() + '\';\r\n';
    SnippetScriptOptions += '    Options' + ClientId + '.Font = \'' + $('#cboFont').val() + '\';\r\n';
    SnippetScriptOptions += '    Options' + ClientId + '.ForceWss = ' + $('#cboForceWss').val() + ';\r\n';
    SnippetScriptOptions += '    Options' + ClientId + '.Hostname = \'' + $('#txtHostname').val() + '\';\r\n';
    SnippetScriptOptions += '    Options' + ClientId + '.LocalEcho = ' + $('#cboLocalEcho').val() + ';\r\n';
    SnippetScriptOptions += '    Options' + ClientId + '.Port = ' + $('#txtPort').val() + ';\r\n';
    if ($('#cboProxyServer').val() !== 'none') {
        var HostPorts = $('#cboProxyServer').val().split(':');
        SnippetScriptOptions += '    Options' + ClientId + '.ProxyHostname = \'proxy-' + HostPorts[0] + '.ftelnet.ca\';\r\n';
        SnippetScriptOptions += '    Options' + ClientId + '.ProxyPort = ' + HostPorts[1] + ';\r\n';
        SnippetScriptOptions += '    Options' + ClientId + '.ProxyPort = ' + HostPorts[2] + ';\r\n';
    }        
    if ($('#cboConnectionType').val() === 'rlogin') {
        SnippetScriptOptions += '    Options' + ClientId + '.RLoginClientUsername = \'' + $('#txtRLoginClientUsername').val() + '\';\r\n';
        SnippetScriptOptions += '    Options' + ClientId + '.RLoginServerUsername = \'' + $('#txtRLoginServerUsername').val() + '\';\r\n';
        SnippetScriptOptions += '    Options' + ClientId + '.RLoginTerminalType = \'' + $('#txtRLoginTerminalType').val() + '\';\r\n';
    }
    SnippetScriptOptions += '    Options' + ClientId + '.ScreenColumns = ' + $('#txtScreenColumns').val() + ';\r\n';
    SnippetScriptOptions += '    Options' + ClientId + '.ScreenRows = ' + $('#txtScreenRows').val() + ';\r\n';
    if (SplashScreen !== '') {
        SnippetScriptOptions += '    Options' + ClientId + '.SplashScreen = \'' + SplashScreen + '\';\r\n';
    }
    if ($('#cboVirtualKeyboardVisible').val() !== 'auto') {
        SnippetScriptOptions += '    Options' + ClientId + '.VirtualKeyboardVisible = ' + $('#cboVirtualKeyboardVisible').val() + ';\r\n';
    }
    SnippetScriptOptions += '    var fTelnet' + ClientId + ' = new fTelnetClient(\'fTelnetContainer' + ClientId + '\', Options' + ClientId + ');\r\n';
    if ($('#cboAutoConnect').val() === 'true') {
        SnippetScriptOptions += '    fTelnet' + ClientId + '.Connect();\r\n';
    }

    // Update the page with the snippets
    var Snippet = SnippetDiv + SnippetScriptfTelnet + '<script>\r\n' + SnippetScriptOptions + '</script>';
    $('#txtSnippet').val(Snippet);
    
    // Update size of snippet textbox
    var Lines = Snippet.split(/\r\n/).length;
    $('#txtSnippet').attr('rows', Lines);
}