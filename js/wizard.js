var DirectConnectUrl = '';
var SnippetDiv = '';
var SnippetScriptfTelnet = '';
var SnippetScriptOptions = '';
var SplashScreen = '';

$(document).ready(function () {
    // Load the list of proxies
    LoadProxies();

    // Update the output, just in case they refreshed while on the wizard page
    Update();
});

var CheckBoxes = '#chkNegotiateLocalEcho, #chkUniqueIds';
$(CheckBoxes).click(function () {
    Update();
});

var ComboBoxes = '#cboAutoConnect, #cboBareLFtoCRLF, #cboBitsPerSecond, #cboConnectionType, #cboEmulation, #cboEnter, #cboFileTransfer, #cboFont, #cboForceWss, #cboLocalEcho, #cboProxyServer, #cboSendLocation, #cboVirtualKeyboardVisible';
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

function LoadProxies() {
    var opt = $('#optProxies');

    $.getJSON('../proxy-servers.json', function(data) {
        for (key in data) {
            // Only process if the server has a Hostname property.  Some are only CNAMEs that redirect to real servers, and we don't want to list those
            var server = data[key];
            if (server['Hostname']) {
                opt.append('<option value="' + server['Hostname'] + ':' + server['WsPort'] + ':' + server['WssPort'] + '">' + server['Country'] + ' (' + server['City'] + ')</option>')
            }
        }
    });
}

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
    DirectConnectUrl = location.protocol + '//embed-v2.ftelnet.ca/connect/';
    SnippetScriptOptions += '    Options' + ClientId + '.BareLFtoCRLF = ' + $('#cboBareLFtoCRLF').val() + ';\r\n';
    DirectConnectUrl += '?BareLFtoCRLF=' + $('#cboBareLFtoCRLF').val();
    SnippetScriptOptions += '    Options' + ClientId + '.BitsPerSecond = ' + $('#cboBitsPerSecond').val() + ';\r\n';
    DirectConnectUrl += '&BitsPerSecond=' + $('#cboBitsPerSecond').val();
    SnippetScriptOptions += '    Options' + ClientId + '.ConnectionType = \'' + $('#cboConnectionType').val() + '\';\r\n';
    DirectConnectUrl += '&ConnectionType=' + $('#cboConnectionType').val();
    SnippetScriptOptions += '    Options' + ClientId + '.Emulation = \'' + $('#cboEmulation').val() + '\';\r\n';
    DirectConnectUrl += '&Emulation=' + $('#cboEmulation').val();
    SnippetScriptOptions += '    Options' + ClientId + '.Enter = \'' + $('#cboEnter').val() + '\';\r\n';
    DirectConnectUrl += '&Enter=' + $('#cboEnter').val();
    SnippetScriptOptions += '    Options' + ClientId + '.Font = \'' + $('#cboFont').val() + '\';\r\n';
    DirectConnectUrl += '&Font=' + $('#cboFont').val();
    SnippetScriptOptions += '    Options' + ClientId + '.ForceWss = ' + $('#cboForceWss').val() + ';\r\n';
    DirectConnectUrl += '&ForceWss=' + $('#cboForceWss').val();
    SnippetScriptOptions += '    Options' + ClientId + '.Hostname = \'' + $('#txtHostname').val() + '\';\r\n';
    DirectConnectUrl += '&Hostname=' + $('#txtHostname').val();
    SnippetScriptOptions += '    Options' + ClientId + '.LocalEcho = ' + $('#cboLocalEcho').val() + ';\r\n';
    DirectConnectUrl += '&LocalEcho=' + $('#cboLocalEcho').val();
    SnippetScriptOptions += '    Options' + ClientId + '.NegotiateLocalEcho = ' + ($('#chkNegotiateLocalEcho').is(':checked') ? 'true' : 'false') + ';\r\n';
    DirectConnectUrl += '&NegotiateLocalEcho=' + ($('#chkNegotiateLocalEcho').is(':checked') ? 'true' : 'false');
    SnippetScriptOptions += '    Options' + ClientId + '.Port = ' + $('#txtPort').val() + ';\r\n';
    DirectConnectUrl += '&Port=' + $('#txtPort').val();
    if ($('#cboProxyServer').val() !== 'none') {
        var HostPorts = $('#cboProxyServer').val().split(':');
        SnippetScriptOptions += '    Options' + ClientId + '.ProxyHostname = \'' + HostPorts[0] + '\';\r\n';
        DirectConnectUrl += '&ProxyHostname=' + HostPorts[0];
        SnippetScriptOptions += '    Options' + ClientId + '.ProxyPort = ' + HostPorts[1] + ';\r\n';
        DirectConnectUrl += '&ProxyPort=' + HostPorts[1];
        SnippetScriptOptions += '    Options' + ClientId + '.ProxyPortSecure = ' + HostPorts[2] + ';\r\n';
        DirectConnectUrl += '&ProxyPortSecure=' + HostPorts[2];
    }        
    if ($('#cboConnectionType').val() === 'rlogin') {
        SnippetScriptOptions += '    Options' + ClientId + '.RLoginClientUsername = \'' + $('#txtRLoginClientUsername').val() + '\';\r\n';
        DirectConnectUrl += '&RLoginClientUsername=' + $('#txtRLoginClientUsername').val();
        SnippetScriptOptions += '    Options' + ClientId + '.RLoginServerUsername = \'' + $('#txtRLoginServerUsername').val() + '\';\r\n';
        DirectConnectUrl += '&RLoginServerUsername=' + $('#txtRLoginServerUsername').val();
        SnippetScriptOptions += '    Options' + ClientId + '.RLoginTerminalType = \'' + $('#txtRLoginTerminalType').val() + '\';\r\n';
        DirectConnectUrl += '&RLoginTerminalType=' + $('#txtRLoginTerminalType').val();
    }
    SnippetScriptOptions += '    Options' + ClientId + '.ScreenColumns = ' + $('#txtScreenColumns').val() + ';\r\n';
    DirectConnectUrl += '&ScreenColumns=' + $('#txtScreenColumns').val();
    SnippetScriptOptions += '    Options' + ClientId + '.ScreenRows = ' + $('#txtScreenRows').val() + ';\r\n';
    DirectConnectUrl += '&ScreenRows=' + $('#txtScreenRows').val();
    SnippetScriptOptions += '    Options' + ClientId + '.SendLocation = ' + $('#cboSendLocation').val() + ';\r\n';
    DirectConnectUrl += '&SendLocation=' + $('#cboSendLocation').val();
    if (SplashScreen !== '') {
        SnippetScriptOptions += '    Options' + ClientId + '.SplashScreen = \'' + SplashScreen + '\';\r\n';
        // ConnectUrl does not support SplashScreen
    }
    if ($('#cboVirtualKeyboardVisible').val() !== 'auto') {
        SnippetScriptOptions += '    Options' + ClientId + '.VirtualKeyboardVisible = ' + $('#cboVirtualKeyboardVisible').val() + ';\r\n';
        DirectConnectUrl += '&VirtualKeyboardVisible=' + $('#cboVirtualKeyboardVisible').val();
    }
    SnippetScriptOptions += '    var fTelnet' + ClientId + ' = new fTelnetClient(\'fTelnetContainer' + ClientId + '\', Options' + ClientId + ');\r\n';
    if ($('#cboAutoConnect').val() === 'true') {
        SnippetScriptOptions += '    fTelnet' + ClientId + '.Connect();\r\n';
        DirectConnectUrl += '&AutoConnect=' + $('#cboAutoConnect').val();
    }

    // Update the page with the snippets
    var Snippet = SnippetDiv + SnippetScriptfTelnet + '<script>\r\n' + SnippetScriptOptions + '</script>';
    $('#txtSnippet').val(Snippet);
    
    // Update size of snippet textbox
    var Lines = Snippet.split(/\r\n/).length;
    $('#txtSnippet').attr('rows', Lines);

    // Update the direct connect link
    $('#lnkDirectConnect').attr('href', DirectConnectUrl);
}