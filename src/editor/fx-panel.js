/**
 * FX Animation inspector panel component.
 *
 * Adds an "FX Animation" panel to every block's sidebar.
 * Reads/writes CSS classes on the block — no custom attributes.
 */

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	Button,
	__experimentalNumberControl as NumberControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { InspectorControls, BlockControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { MenuItem } from '@wordpress/components';
import { BlockSettingsMenuControls } from '@wordpress/block-editor';

import {
	parseFxClasses,
	generateFxClasses,
	EFFECTS,
	SCRUB_EFFECTS,
} from './utils';

const EASE_OPTIONS = [
	{ value: '', label: 'Default' },
	{ value: 'power1.out', label: 'power1.out' },
	{ value: 'power2.out', label: 'power2.out' },
	{ value: 'power3.out', label: 'power3.out' },
	{ value: 'power4.out', label: 'power4.out' },
	{ value: 'power2.inOut', label: 'power2.inOut' },
	{ value: 'power3.inOut', label: 'power3.inOut' },
	{ value: 'back.out(1.7)', label: 'back.out' },
	{ value: 'elastic.out(1,0.3)', label: 'elastic.out' },
	{ value: 'none', label: 'none (linear)' },
];

// START_OPTIONS removed — using free text input instead

const STORAGE_KEY = 'fancoolo-fx-clipboard';

function CopyPasteButtons( { parsed, onPaste, onClear } ) {
	const [ copied, setCopied ] = useState( false );
	const hasClipboard = !! localStorage.getItem( STORAGE_KEY );

	const handleCopy = () => {
		const data = {
			effect: parsed.effect,
			trigger: parsed.trigger,
			modifiers: parsed.modifiers,
		};
		localStorage.setItem( STORAGE_KEY, JSON.stringify( data ) );
		setCopied( true );
		setTimeout( () => setCopied( false ), 1500 );
	};

	const handlePaste = () => {
		try {
			const data = JSON.parse( localStorage.getItem( STORAGE_KEY ) );
			if ( data && data.effect ) {
				onPaste( data );
			}
		} catch ( e ) {
			// ignore
		}
	};

	const hasEffect = !! parsed.effect;

	if ( ! hasEffect && ! hasClipboard ) {
		return null;
	}

	return (
		<div style={ { display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e0e0e0', flexWrap: 'wrap' } }>
			{ hasEffect && (
				<Button
					variant="secondary"
					onClick={ handleCopy }
					style={ { flex: 1, justifyContent: 'center' } }
				>
					{ copied ? __( 'Copied!', 'fancoolo-fx' ) : __( 'Copy FX', 'fancoolo-fx' ) }
				</Button>
			) }
			{ hasClipboard && (
				<Button
					variant="secondary"
					onClick={ handlePaste }
					style={ { flex: 1, justifyContent: 'center' } }
				>
					{ __( 'Paste FX', 'fancoolo-fx' ) }
				</Button>
			) }
			{ hasEffect && onClear && (
				<Button
					isDestructive
					variant="secondary"
					onClick={ onClear }
					style={ { flex: 1, justifyContent: 'center' } }
				>
					{ __( 'Clear FX', 'fancoolo-fx' ) }
				</Button>
			) }
		</div>
	);
}

/**
 * Higher-order component that adds the FX Animation panel.
 */
const withFxPanel = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { attributes, setAttributes, isSelected } = props;

		if ( ! isSelected ) {
			return <BlockEdit { ...props } />;
		}

		const parsed = parseFxClasses( attributes.className || '' );
		const { effect, trigger, modifiers, otherClasses } = parsed;

		const updateFx = ( changes ) => {
			const newConfig = {
				effect: changes.effect !== undefined ? changes.effect : effect,
				trigger: changes.trigger !== undefined ? changes.trigger : trigger,
				modifiers: changes.modifiers !== undefined
					? { ...modifiers, ...changes.modifiers }
					: modifiers,
				otherClasses,
			};

			// Clear modifiers when effect changes
			if ( changes.effect !== undefined && changes.effect !== effect ) {
				newConfig.modifiers = {};
				// Default trigger for new effect
				if ( SCRUB_EFFECTS.includes( changes.effect ) ) {
					newConfig.trigger = 'st';
				} else if ( changes.effect === 'draw-svg' && changes.trigger === 'scrub' ) {
					newConfig.trigger = 'scrub';
				} else if ( changes.effect && ! newConfig.trigger ) {
					newConfig.trigger = 'st';
				}
			}

			const newClassName = generateFxClasses( newConfig );
			setAttributes( { className: newClassName || undefined } );
		};

		const isScrub = SCRUB_EFFECTS.includes( effect );
		const isDrawSvg = effect === 'draw-svg';
		const isParallax = effect === 'parallax';
		const hasEffect = !! effect;
		const isScrollTrigger = trigger === 'st' || trigger === '' || isScrub;

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'FX Animation', 'fancoolo-fx' ) }
						initialOpen={ hasEffect }
					>
						<SelectControl
							label={ __( 'Effect', 'fancoolo-fx' ) }
							value={ effect }
							options={ [
								{ value: '', label: __( 'None', 'fancoolo-fx' ) },
								...EFFECTS.map( ( e ) => ( {
									value: e.value,
									label: e.label,
								} ) ),
							] }
							onChange={ ( val ) => updateFx( { effect: val } ) }
						/>

						{ hasEffect && ! isScrub && (
							<ToggleGroupControl
								label={ __( 'Animation starts', 'fancoolo-fx' ) }
								value={ trigger === '' ? 'section' : ( trigger || 'st' ) }
								onChange={ ( val ) => updateFx( { trigger: val === 'section' ? '' : val } ) }
								isBlock
							>
								<ToggleGroupControlOption value="st" label={ __( 'Item', 'fancoolo-fx' ) } />
								<ToggleGroupControlOption value="section" label={ __( 'Trigger', 'fancoolo-fx' ) } />
								<ToggleGroupControlOption value="pl" label={ __( 'Page', 'fancoolo-fx' ) } />
								{ isDrawSvg && (
									<ToggleGroupControlOption value="scrub" label={ __( 'Scrub', 'fancoolo-fx' ) } />
								) }
							</ToggleGroupControl>
						) }

						{ hasEffect && (
							<>
								<div style={ { display: 'flex', gap: '8px', marginBottom: '16px' } }>
									<div style={ { flex: 1 } }>
										<NumberControl
											label={ __( 'Duration', 'fancoolo-fx' ) }
											value={ modifiers.duration ?? '' }
											min={ 0 }
											step={ 0.1 }
											placeholder="sec"
											onChange={ ( val ) =>
												updateFx( { modifiers: { duration: val ? parseFloat( val ) : undefined } } )
											}
										/>
									</div>
									<div style={ { flex: 1 } }>
										<NumberControl
											label={ __( 'Delay', 'fancoolo-fx' ) }
											value={ modifiers.delay ?? '' }
											min={ 0 }
											step={ 0.1 }
											placeholder="sec"
											onChange={ ( val ) =>
												updateFx( { modifiers: { delay: val ? parseFloat( val ) : undefined } } )
											}
										/>
									</div>
								</div>

								<SelectControl
									label={ __( 'Ease', 'fancoolo-fx' ) }
									value={ modifiers.ease ?? '' }
									options={ EASE_OPTIONS }
									onChange={ ( val ) =>
										updateFx( { modifiers: { ease: val || undefined } } )
									}
								/>
							</>
						) }

						{ hasEffect && isScrollTrigger && ! isScrub && trigger !== 'scrub' && (
							<TextControl
								label={ __( 'Start Position', 'fancoolo-fx' ) }
								value={ modifiers.start ?? '' }
								placeholder="top 85%"
								help={ __( 'e.g. top 85%, top center, center center', 'fancoolo-fx' ) }
								onChange={ ( val ) =>
									updateFx( { modifiers: { start: val || undefined } } )
								}
							/>
						) }

						{ isParallax && (
							<NumberControl
								label={ __( 'Y Shift (px)', 'fancoolo-fx' ) }
								value={ modifiers.y ?? '' }
								min={ 0 }
								step={ 10 }
								onChange={ ( val ) =>
									updateFx( { modifiers: { y: val ? parseFloat( val ) : undefined } } )
								}
							/>
						) }

						<CopyPasteButtons
							parsed={ parsed }
							onPaste={ ( data ) => {
								const newClassName = generateFxClasses( { ...data, otherClasses } );
								setAttributes( { className: newClassName || undefined } );
							} }
							onClear={ () => {
								setAttributes( { className: otherClasses || undefined } );
							} }
						/>
					</PanelBody>
				</InspectorControls>
				<BlockSettingsMenuControls>
					{ ( { onClose } ) => (
						<>
							<hr style={ { margin: '6px 0', borderTop: '1px solid #e0e0e0', borderBottom: 'none' } } />
							{ hasEffect && (
								<MenuItem
									onClick={ () => {
										localStorage.setItem( STORAGE_KEY, JSON.stringify( {
											effect,
											trigger,
											modifiers,
										} ) );
										onClose();
									} }
								>
									{ __( 'Copy FX animation', 'fancoolo-fx' ) }
								</MenuItem>
							) }
							{ !! localStorage.getItem( STORAGE_KEY ) && (
								<MenuItem
									onClick={ () => {
										try {
											const data = JSON.parse( localStorage.getItem( STORAGE_KEY ) );
											if ( data && data.effect ) {
												const newClassName = generateFxClasses( { ...data, otherClasses } );
												setAttributes( { className: newClassName || undefined } );
											}
										} catch ( e ) { /* ignore */ }
										onClose();
									} }
								>
									{ __( 'Paste FX animation', 'fancoolo-fx' ) }
								</MenuItem>
							) }
							{ hasEffect && (
								<MenuItem
									onClick={ () => {
										setAttributes( { className: otherClasses || undefined } );
										onClose();
									} }
								>
									{ __( 'Clear FX animation', 'fancoolo-fx' ) }
								</MenuItem>
							) }
							<hr style={ { margin: '6px 0', borderTop: '1px solid #e0e0e0', borderBottom: 'none' } } />
						</>
					) }
				</BlockSettingsMenuControls>
			</>
		);
	};
}, 'withFxPanel' );

addFilter( 'editor.BlockEdit', 'fancoolo-fx/inspector', withFxPanel );
