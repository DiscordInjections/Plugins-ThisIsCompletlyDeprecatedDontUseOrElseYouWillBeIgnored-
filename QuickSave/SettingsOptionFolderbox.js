const e = window.DI.React.createElement;

const { dialog } = require('electron').remote;

const { SettingsOptionTitle, SettingsOptionDescription, SettingsOptionButton } = window.DI.require('./Structures/Components');
const SettingsOptionBase = window.DI.require('./Structures/Components/SettingsOptionBase');

class SettingsOptionFolderbox extends SettingsOptionBase {
    constructor(props) {
        super(props);

        this.state = { value: this.getProp() };
    }

    render() {
        let titles = [
            e('div', {
                className: 'flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO',
                style: {
                    flex: '1 1 auto'
                }
            },
                e(SettingsOptionTitle, { text: this.props.title })
            )
        ];
        
        if (this.props.description)
            titles.push(e(SettingsOptionDescription, { text: this.props.description }));

        let icon = this.props.buttonIcon || 'https://cdn.bowser65.tk/i/icon-folder.png';
        let btn_text = this.props.buttonIcon || 'https://cdn.bowser65.tk/i/icon-folder.png';
        
        return e('div', {},
            e('div', {
                className: 'flex-lFgbSz flex-3B1Tl4 vertical-3X17r5 flex-3B1Tl4 directionColumn-2h-LPR justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO switchItem-1uofoz',
                style: {
                    flex: '1 1 auto'
                }
            }, ...titles),
            e('div', { className: 'flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO margin-bottom-20' },
                e('div', {
                    className: 'ui-key-recorder ui-input-button default has-value',
                    style: {
                        width: '90%'
                    }
                },
                    e('div', {
                        className: 'flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO layout',
                        style: {
                            flex: '1 1 auto',
                            background: 'none'
                        }
                    },
                        e('input', {
                            className: 'inputDefault-Y_U37D input-2YozMi size16-3IvaX_ flexChild-1KGW5q',
                            type: this.props.password ? 'password' : 'text',
                            placeholder: this.props.defaultValue || this.props.placeholder || undefined,
                            name: this.props.name || undefined,
                            maxlength: this.props.maxlength || undefined,
                            value: this.state.value,
                            onChange: this.change.bind(this),
                            style: {
                                flex: '1 1 auto',
                                background: 'none',
                                border: 'none'
                            }
                        }),
                        e('div', {
                            className: 'flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO',
                            style: {
                                flex: '0 1 auto',
                                margin: '0px'
                            }
                        },
                            e('button', {
                                type: 'button',
                                className: 'buttonGreyGhostDefault-2h5dqi buttonGhostDefault-2NFSwJ buttonDefault-2OLW-v button-2t3of8 buttonGhost-2Y7zWJ buttonGreyGhost-SfY7zU minGrow-1W9N45 min-K7DTfI ui-input-button-ui-button key-recorder-button',
                                onClick: this.fileSelector.bind(this)
                            },
                                e('div', {
                                    className: 'contentsDefault-nt2Ym5 contents-4L4hQM contentsGhost-2Yp1r8'
                                },
                                    e('span', {
                                        className: 'key-recorder-button-text'
                                    }, this.props.buttonName || 'Choose a folder...'),
                                    e('span', {
                                        className: 'key-recorder-edit-icon',
                                        style: {
                                            backgroundImage: 'url(' + icon + ')'
                                        }
                                    })
                                )
                            )
                        )
                    )
                ),
                this.props.apply ? e(SettingsOptionButton, { outline: false, text: 'Apply', onClick: this.apply.bind(this) }) : undefined,
                this.props.reset ? e(SettingsOptionButton, { outline: true, text: 'Reset', onClick: this.reset.bind(this) }) : undefined
            )
        );
    }
    
    apply(event) {
        let value = this.state.value || this.props.defaultValue;
        this.setProp(value);

        if (this.props.onApply)
            this.props.onApply(event);
    }

    change(event) {
        this.setState({ value: event.target.value });
        if (!this.props.apply)
            this.setProp(event.target.value || this.props.defaultValue);
    }

    reset(event) {
        this.setState({ value: '' });
        this.apply(event);
    }
    
    fileSelector(event){
        let _this = this;
        dialog.showOpenDialog({
            title: 'Select Folder',
            properties : ['openDirectory']
        }, function(filePath){
            _this.setState({ value: filePath[0] });
        });
    }
}

module.exports = SettingsOptionFolderbox;