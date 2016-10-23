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
        ClientId = '_' + $('#txtHostname').val().replace(/[.]/g, '-') + '_' + $('#txtPort').val();
    }
    
    // Check RIP and XFER support
    var RIP = $('#cboEmulation').val() === 'RIP' ? 'rip' : 'norip';
    var XFER = $('#cboFileTransfer').val() === 'true' ? 'xfer' : 'noxfer';
    
    // Build the snippet
    var Snippet = '<div id="fTelnetContainer' + ClientId + '"></div>\r\n';
    // TODOX norip.noxfer stuff
    Snippet += '<script>document.write(\'<script src="//embed-v2.ftelnet.ca/js/ftelnet-loader.' + RIP + '.' + XFER + '.js?v=\' + (new Date()).getTime() + \'"><\\/script>\');</script>\r\n';
    Snippet += '<script>\r\n';
    Snippet += '    var Options' + ClientId + ' = new fTelnetOptions();\r\n';
    Snippet += '    Options' + ClientId + '.BareLFtoCRLF = ' + $('#cboBareLFtoCRLF').val() + ';\r\n';
    Snippet += '    Options' + ClientId + '.BitsPerSecond = ' + $('#cboBitsPerSecond').val() + ';\r\n';
    Snippet += '    Options' + ClientId + '.ConnectionType = \'' + $('#cboConnectionType').val() + '\';\r\n';
    Snippet += '    Options' + ClientId + '.Emulation = \'' + $('#cboEmulation').val() + '\';\r\n';
    Snippet += '    Options' + ClientId + '.Enter = \'' + $('#cboEnter').val() + '\';\r\n';
    Snippet += '    Options' + ClientId + '.Font = \'' + $('#cboFont').val() + '\';\r\n';
    Snippet += '    Options' + ClientId + '.ForceWss = ' + $('#cboForceWss').val() + ';\r\n';
    Snippet += '    Options' + ClientId + '.Hostname = \'' + $('#txtHostname').val() + '\';\r\n';
    Snippet += '    Options' + ClientId + '.LocalEcho = ' + $('#cboLocalEcho').val() + ';\r\n';
    Snippet += '    Options' + ClientId + '.Port = ' + $('#txtPort').val() + ';\r\n';
    if ($('#cboProxyServer').val() !== 'none') {
        var HostPorts = $('#cboProxyServer').val().split(':');
        Snippet += '    Options' + ClientId + '.ProxyHostname = \'proxy-' + HostPorts[0] + '.ftelnet.ca\';\r\n';
        Snippet += '    Options' + ClientId + '.ProxyPort = ' + HostPorts[1] + ';\r\n';
        Snippet += '    Options' + ClientId + '.ProxyPort = ' + HostPorts[2] + ';\r\n';
    }        
    if ($('#cboConnectionType').val() === 'rlogin') {
        Snippet += '    Options' + ClientId + '.RLoginClientUsername = \'' + $('#txtRLoginClientUsername').val() + '\';\r\n';
        Snippet += '    Options' + ClientId + '.RLoginServerUsername = \'' + $('#txtRLoginServerUsername').val() + '\';\r\n';
        Snippet += '    Options' + ClientId + '.RLoginTerminalType = \'' + $('#txtRLoginTerminalType').val() + '\';\r\n';
    }
    Snippet += '    Options' + ClientId + '.ScreenColumns = ' + $('#txtScreenColumns').val() + ';\r\n';
    Snippet += '    Options' + ClientId + '.ScreenRows = ' + $('#txtScreenRows').val() + ';\r\n';
    // TODOX SplashScreen
    if ($('#cboVirtualKeyboardVisible').value !== 'auto') {
        Snippet += '    Options' + ClientId + '.VirtualKeyboardVisible = ' + $('#cboVirtualKeyboardVisible').val() + ';\r\n';
    }
    Snippet += '    var fTelnet' + ClientId + ' = new fTelnetClient(\'fTelnetContainer' + ClientId + '\', Options' + ClientId + ');\r\n';
    if ($('#cboAutoConnect').val() === 'true') {
        Snippet += '    fTelnet' + ClientId + '.Connect();\r\n';
    }
    Snippet += '</script>\r\n';

    // Update the page with the snippets
    $('#txtSnippet').val(Snippet);
    
    // Update size of snippet textbox
    var Lines = Snippet.split(/\r\n/).length;
    $('#txtSnippet').attr('rows', Lines);
}