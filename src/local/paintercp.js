var PainterCp   = (function(){
'use strict';

    var PainterCPList   = function(sourceXml){
        this.create(sourceXml);
    };
    PainterCPList.prototype = {
        create    : function(sourceXml){
            var pts     = [];
            $(sourceXml).find('palette').each(function(index,item){
                pts.push({
                    id      :   $(item).attr('id')
                    ,name   :   $(item).attr('name')
                });
            });
            this.palettes   = pts;
        }
        ,palettes   :   null
    };


    var PainterPalette   = function(sourceXml){
        this.create(sourceXml);
    };
    PainterPalette.prototype = {
        create    : function(sourceXml){
            
            var doc         = $(sourceXml);
            this.id         = doc.find('palette').attr('id');
            this.caption    = doc.find('palette').attr('caption');
            this.cmds       = [];
            var cmds        = this.cmds;
            doc.find('command').each(function(index,item){
                var type    = $(item).attr('type');
                var cmd;
                switch (type) {
                    case PainterCmd.CMD_SET_BRUSH:
                        cmd     = new PainterCmd({
                            type        : type
                            ,name       : $(item).attr('name')
                            ,row        : $(item).attr('row')
                            ,col        : $(item).attr('col')
                            ,span       : $(item).attr('span')
                            ,textMode   : $(item).attr('text-mode')
                            ,imageGuid  : $(item).attr('image-guid')
                            ,library    : $(item).attr('library')
                            ,category   : $(item).attr('category')
                            ,variant    : $(item).attr('variant')

                        });
                        break;

                    case PainterCmd.CMD_MENU:
                        cmd     = new PainterCmd({
                            type        : type
                            ,name       : $(item).attr('name')
                            ,guid       : $(item).attr('guid')
                            ,row        : $(item).attr('row')
                            ,col        : $(item).attr('col')
                            ,span       : $(item).attr('span')
                            ,textMode   : $(item).attr('text-mode')
                            ,imageGuid  : $(item).attr('image-guid')

                        });
                        break;

                    case PainterCmd.CMD_SET_NOZZLE:
                        cmd     = new PainterCmd({
                            type        : type
                            ,name       : $(item).attr('name')
                            ,key        : $(item).attr('key')
                            ,row        : $(item).attr('row')
                            ,col        : $(item).attr('col')
                            ,span       : $(item).attr('span')
                            ,textMode   : $(item).attr('text-mode')
                            ,imageGuid  : $(item).attr('image-guid')
                            ,library    : $(item).attr('library')

                        });
                        break;

                    case PainterCmd.CMD_SET_PAPER:
                        cmd     = new PainterCmd({
                            type        : type
                            ,name       : $(item).attr('name')
                            ,key        : $(item).attr('key')
                            ,row        : $(item).attr('row')
                            ,col        : $(item).attr('col')
                            ,span       : $(item).attr('span')
                            ,textMode   : $(item).attr('text-mode')
                            ,imageGuid  : $(item).attr('image-guid')
                            ,library    : $(item).attr('library')

                        });
                        break;
                
                    default:
                        break;
                }
                cmds.push(cmd);
            }); //end each command elem
            
            try{
                this.cmds.sort(function(cmd1,cmd2){
                    return cmd1.props.row!=cmd2.props.row
                        ?cmd1.props.row - cmd2.props.row
                        :cmd1.props.col - cmd2.props.col
                        ;
                });
            }catch(ex){}

        }// end function create

        ,id         : null
        ,caption    : null
        ,cmds       : null

    };

    var PainterCmd  = function(attrs){
        this.create(attrs);
    };
    PainterCmd.CMD_SET_BRUSH    = 'CCmdSetBrush';
    PainterCmd.CMD_MENU         = 'MenuCommand';
    PainterCmd.CMD_SET_NOZZLE   = 'Corel::Painter::Commands::CCmdSetNozzle';
    PainterCmd.CMD_SET_PAPER    = 'Corel::Painter::Commands::CCmdSetPaper';

    PainterCmd.prototype    = {
        create      : function(attrs){

            this.props      = {};
            for(var key in attrs){
                this.props[key]    = attrs[key];
            }
            if(this.props.imageGuid){
                this.itemImgUrl     = '/api/12.1/image/select?GUID=' + this.props.imageGuid; 
            }
        }

        ,itemImgUrl :   null

        ,execCmd    :   function(onsuccess,onfail){
            switch (this.props.type) {
                case PainterCmd.CMD_SET_BRUSH:
                    PainterApi.setBrush(
                         this.props.library
                        ,this.props.category
                        ,this._encodeVarName(this.props.variant,this.props.name)
                        );
                    break;

                case PainterCmd.CMD_MENU:
                    PainterApi.menuCommand(
                         this.props.guid
                        );
                    break;

                case PainterCmd.CMD_SET_PAPER:
                    PainterApi.setPaper(
                         this.props.library
                        ,this.props.key
                        );
                    break;

                case PainterCmd.CMD_SET_NOZZLE:
                    PainterApi.setNozzle(
                         this.props.library
                        ,this.props.key
                        );
                    break;


                default:
                    break;
            }
        }

        ,_encodeVarName    :   function(varName,dispName){
            if(varName.match(/^[-_0-9a-zA-Z ()\[\]!"#$%&'.,:;*+=]+$/)){
                return encodeURIComponent(varName);
            }else{
                if(!dispName.normalize){alert("normalize is not implimented")}
                return EscapeSJIS(dispName.normalize());
            }
        }

    };

    return {
        PainterCPList   :   PainterCPList
        ,PainterPalette :   PainterPalette
        ,PainterCmd     :   PainterCmd
    };

})();