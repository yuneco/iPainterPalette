var PainterApi = (function(){
'use strict';

    var _api    = {
        authorize   :   {path:'/authorize', data:['accesscode']}
        ,cplist     :   {path:'/api/12.1/cp/list', data:[]}
        ,cpitems    :   {path:'/api/12.1/cp/select', data:['GUID']}
        ,setBrush   :   {path:'/api/12.1/brushes/select', data:['type','lib','cat','var']}
        ,menuCommand:   {path:'/api/12.1/commands/select', data:['type','GUID']}
        ,setPaper   :   {path:'/api/12.1/content/select', data:['type','lib','item']}
        ,setNozzle  :   {path:'/api/12.1/content/select', data:['type','lib','item']}
    };
    var CMD_SET_BRUSH   = 'Corel::Painter::Commands::CCmdSetBrush';
    var CMD_SET_PAPER   = 'Corel::Painter::Commands::CCmdSetPaper';
    var CMD_SET_NOZZLE  = 'Corel::Painter::Commands::CCmdSetNozzle';


    var getApi  = function(name){
        if(!_api[name]){throw 'no api found : ' + name}
        var data    = {};
        var param   = _api[name].data;
        for(var i=0;i<param.length;i++){
            data[param[i]] = null;
        }
        var ret    = {path:_api[name].path,data:data};
        if(Object.seal && Object.freeze){
            Object.seal(ret.data);  //パラメータの追加・削除を禁止
            Object.freeze(ret);     //パスの変更を禁止
        }
        return ret;
    }
    var callApi = function(settings,api,onsuccess,onfail,noencode){
        var param = '';
        if(noencode){
            for(var key in api.data){
                param    += param?'&':'?';
                param    += key + '=' + api.data[key];
            }
        }
        $.ajax({
            type    : 'GET'
            ,url    : settings.host + ':' + settings.port + api.path + (noencode?param:'')
            ,data   : (noencode?null:api.data)
            ,success: (onsuccess || function(msg){console.log(msg)})
            ,fail   : (onfail || function(msg){console.log(msg)})
            ,processData:!noencode
        });
    }

    var me = {
        
        settings    :   {
            host        :   'localhost'
            ,port       :   '26735'
        }

        ,authorize  :   function(host,port,authCode,onsuccess,onfail){
            me.settings.host        = host;
            me.settings.port        = port;
            
            var api = getApi('authorize');
            api.data.accesscode     = authCode;
            callApi(me.settings,api,onsuccess,onfail);
        }

        ,cplist     :   function(onsuccess,onfail){
            var api = getApi('cplist');
            callApi(me.settings,api,onsuccess,onfail);
        }

        ,cpitems    :   function(guid,onsuccess,onfail){
            var api = getApi('cpitems');
            api.data.GUID     = guid;
            callApi(me.settings,api,onsuccess,onfail);
        }

        /**
         * 注意：このAPIはパラメータをURIエンコードしません。呼び出し側で適切にエンコードしてください。
         * これはPainterがカスタムされたブラシの名前をSJISで返すことに対応するための仕様です。
         */
        ,setBrush   :   function(lib,cat,variant,onsuccess,onfail){
            var api = getApi('setBrush');
            api.data.type     = CMD_SET_BRUSH;
            api.data.lib      = lib;
            api.data.cat      = cat;
            api.data['var']   = variant;
            callApi(me.settings,api,onsuccess,onfail,true); //jQueryによるエンコードを行わない
        }

        ,menuCommand    :   function(guid,onsuccess,onfail){
            var api = getApi('menuCommand');
            api.data.GUID      = guid;
            callApi(me.settings,api,onsuccess,onfail);            
        }

        ,setPaper   :   function(lib,item,onsuccess,onfail){
            var api = getApi('setPaper');
            api.data.type     = CMD_SET_PAPER;
            api.data.lib      = lib;
            api.data.item     = item;
            callApi(me.settings,api,onsuccess,onfail); 
        }

        ,setNozzle   :   function(lib,item,onsuccess,onfail){
            var api = getApi('setNozzle');
            api.data.type     = CMD_SET_NOZZLE;
            api.data.lib      = lib;
            api.data.item     = item;
            callApi(me.settings,api,onsuccess,onfail,true); 
        }

    };

    return me;
})();
