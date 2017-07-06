

var vm = new Vue({
    el: '#vueapp'
    ,data: {
        title       :   'PainterPalettes'
        ,settings  :   {
            authCode :   '12345'
        }
        ,cplist     : null
        ,palette    : null
        ,selectedCpId       : null
        ,selectedCpItems    : null
    }
    ,methods: {
        connect     :   function(){
            var st  = vm.settings;
            PainterApi.authorize(
                document.location.protocol + '//' + document.location.hostname
                , document.location.port
                , st.authCode, function(){
                PainterApi.cplist(function(xml){
                    vm.cplist = new PainterCp.PainterCPList(xml);
                });
            });
        }
        ,loadPaletteItems  :   function(){
            this.selectedCpItems = null;
            if(this.selectedCpId){
                PainterApi.cpitems(this.selectedCpId,function(xml){
                    this.selectedCpItems = new PainterCp.PainterPalette(xml);
                }.bind(this));
            }
        }
        ,execCmd            :   function(cmd){
            console.log(cmd.props.name);
            cmd.execCmd();
        }
    }
    ,computed: {
    }
    
});

