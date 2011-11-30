/*
 *    Copyright [2011] [wisemapping]
 *
 *   Licensed under WiseMapping Public License, Version 1.0 (the "License").
 *   It is basically the Apache License, Version 2.0 (the "License") plus the
 *   "powered by wisemapping" text requirement on every single page;
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the license at
 *
 *       http://www.wisemapping.org/license
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

mindplot.widget.ThinkmappingMenu = new Class({
    Extends: mindplot.widget.IMenu,

    initialize: function(designer, containerId, mapId) {
        this.parent(designer, containerId, mapId);

        var baseUrl = "../css/widget";

        // Stop event propagation ...
        $(this._containerId).addEvent('click', function(event) {
            event.stopPropagation();
            return false;
        });

        $(this._containerId).addEvent('dblclick', function(event) {
            event.stopPropagation();
            return false;
        });

        // Create panels ...
        var designerModel = designer.getModel();

        // DummyModel
        var dummyModel =
        {
            getValue : function() {
                return null;
            },
            setValue : function (hex) {
                // Do Nothing
            }
        };
        this._toolbarElems.push(new mindplot.widget.PersonalisePanel('personaliseButton', dummyModel, baseUrl));
        this._toolbarElems.push(new mindplot.widget.AttachPanel('attachButton', dummyModel, baseUrl));
        this._toolbarElems.push(new mindplot.widget.SharePanel('shareButton', dummyModel, baseUrl));
        this._toolbarElems.push(new mindplot.widget.UserPanel('userButton', dummyModel, baseUrl));

        this.addButton('newButton', false, false, function() {
            var reqDialog = new MooDialog.Request('newMapDialog.htm', null,
                {'class': 'newModalDialog',
                    closeButton:true,
                    destroyOnClose:true,
                    title:'Nouveau map'
                });
            reqDialog.setRequestOptions({
                onRequest: function() {
                    reqDialog.setContent('loading...');
                }
            });
            MooDialog.Request.active = reqDialog;
        });

        this.addButton('importButton', false, false, function() {
            var reqDialog = new MooDialog.Request('importMap.htm', null,
                {'class': 'importModalDialog',
                    closeButton:true,
                    destroyOnClose:true,
                    title:'Importez votre map'
                });
            reqDialog.setRequestOptions({
                onRequest: function() {
                    reqDialog.setContent('loading...');
                }
            });
            MooDialog.Request.active = reqDialog;
        });
        this.addButton('headerMapTitle', false, false, function() {
            var reqDialog = new MooDialog.Request('renameMap.htm?mapId='+mapId, null,
                {'class': 'renameModalDialog',
                    closeButton:true,
                    destroyOnClose:true,
                    title:'Renommez votre map'
                });
            reqDialog.setRequestOptions({
                onRequest: function() {
                    reqDialog.setContent('loading...');
                }
            });
            MooDialog.Request.active = reqDialog;
        });
        this.addButton('communicateButton', false, false, function() {
            var reqDialog = new MooDialog.Request('sharing.htm?mapId='+mapId, null,
                {'class': 'communicateModalDialog',
                    closeButton:true,
                    destroyOnClose:true,
                    title:'Collaboration'
                });
            reqDialog.setRequestOptions({
                onRequest: function() {
                    reqDialog.setContent('loading...');
                }
            });
            MooDialog.Request.active = reqDialog;
        });
        this._addButton('save', false, false, function() {
            this._save(saveElem, designer, true);
        }.bind(this));

        this._registerEvents(designer);
    },

    _registerEvents : function(designer) {

        // Register on close events ...
        this._toolbarElems.forEach(function(elem) {
            elem.addEvent('show', function() {
                this.clear()
            }.bind(this));
        }.bind(this));

        designer.addEvent('onblur', function() {
            var topics = designer.getModel().filterSelectedTopics();
            var rels = designer.getModel().filterSelectedRelations();

            this._toolbarElems.forEach(function(button) {
                var disable = false;
                if (button.isTopicAction() && button.isRelAction()) {
                    disable = rels.length == 0 && topics.length == 0;

                } else if (!button.isTopicAction() && !button.isRelAction()) {
                    disable = false;
                }
                else if (button.isTopicAction() && topics.length == 0) {
                    disable = true;
                } else if (button.isRelAction() && rels.length == 0) {
                    disable = true;
                }

                if (disable) {
                    button.disable();
                } else {
                    button.enable();
                }

            })
        }.bind(this));

        designer.addEvent('onfocus', function() {
            var topics = designer.getModel().filterSelectedTopics();
            var rels = designer.getModel().filterSelectedRelations();

            this._toolbarElems.forEach(function(button) {
                if (button.isTopicAction() && topics.length > 0) {
                    button.enable();
                }

                if (button.isRelAction() && rels.length > 0) {
                    button.enable();
                }
            })
        }.bind(this));
    }
})
