<?php
/**
 * Plugin Name: Fancoolo FX
 * Plugin URI: https://github.com/krstivoja/gsap-animations-template
 * Description: A class-driven GSAP animation wrapper. Add CSS classes in Gutenberg and get animations — no JavaScript needed.
 * Version: 1.0.0
 * Author: Fancoolo
 * Author URI: https://github.com/krstivoja
 * License: ISC
 * Text Domain: fancoolo-fx
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'FANCOOLO_FX_VERSION', '1.0.0' );
define( 'FANCOOLO_FX_PATH', plugin_dir_path( __FILE__ ) );
define( 'FANCOOLO_FX_URL', plugin_dir_url( __FILE__ ) );

/**
 * ─── Frontend: Enqueue GSAP + FX scripts ────────────────────────────
 */
function fancoolo_fx_enqueue_scripts() {
	// 1. GSAP core
	wp_enqueue_script(
		'gsap',
		FANCOOLO_FX_URL . 'assets/gsap.min.js',
		array(),
		'3.14.2',
		true
	);

	// 2. ScrollTrigger
	wp_enqueue_script(
		'gsap-scrolltrigger',
		FANCOOLO_FX_URL . 'assets/ScrollTrigger.min.js',
		array( 'gsap' ),
		'3.14.2',
		true
	);

	// 3. SplitText
	wp_enqueue_script(
		'gsap-splittext',
		FANCOOLO_FX_URL . 'assets/SplitText.min.js',
		array( 'gsap' ),
		'3.14.2',
		true
	);

	// 4. Fancoolo FX
	wp_enqueue_script(
		'fancoolo-fx',
		FANCOOLO_FX_URL . 'assets/fx.js',
		array( 'gsap', 'gsap-scrolltrigger', 'gsap-splittext' ),
		FANCOOLO_FX_VERSION,
		true
	);

	// 5. Custom modifiers (if file exists and is not empty)
	$custom_file = fancoolo_fx_get_custom_file_path();
	if ( file_exists( $custom_file ) && filesize( $custom_file ) > 0 ) {
		$upload_dir = wp_upload_dir();
		$custom_url = $upload_dir['baseurl'] . '/fancoolo-fx/custom.js';
		wp_enqueue_script(
			'fancoolo-fx-custom',
			$custom_url,
			array( 'fancoolo-fx' ),
			filemtime( $custom_file ),
			true
		);
	}
}
add_action( 'wp_enqueue_scripts', 'fancoolo_fx_enqueue_scripts' );

/**
 * ─── Helper: Get path to custom.js in uploads ──────────────────────
 */
function fancoolo_fx_get_custom_file_path() {
	$upload_dir = wp_upload_dir();
	return $upload_dir['basedir'] . '/fancoolo-fx/custom.js';
}

/**
 * ─── Admin: Register settings page under Appearance ─────────────────
 */
function fancoolo_fx_add_admin_page() {
	add_theme_page(
		'Fancoolo FX',
		'Fancoolo FX',
		'edit_theme_options',
		'fancoolo-fx',
		'fancoolo_fx_render_admin_page'
	);
}
add_action( 'admin_menu', 'fancoolo_fx_add_admin_page' );

/**
 * ─── Admin: Enqueue CodeMirror on our settings page ─────────────────
 */
function fancoolo_fx_admin_enqueue( $hook ) {
	if ( 'appearance_page_fancoolo-fx' !== $hook ) {
		return;
	}

	// WordPress built-in CodeMirror
	$settings = wp_enqueue_code_editor( array( 'type' => 'text/javascript' ) );

	if ( false !== $settings ) {
		wp_add_inline_script(
			'code-editor',
			sprintf(
				'jQuery(function($) {
					if ($("#fancoolo-fx-editor").length) {
						var editor = wp.codeEditor.initialize($("#fancoolo-fx-editor"), %s);
						// Auto-resize
						editor.codemirror.on("change", function(cm) {
							cm.refresh();
						});
					}
				});',
				wp_json_encode( $settings )
			)
		);
	}
}
add_action( 'admin_enqueue_scripts', 'fancoolo_fx_admin_enqueue' );

/**
 * ─── Admin: Handle form save ────────────────────────────────────────
 */
function fancoolo_fx_handle_save() {
	if ( ! isset( $_POST['fancoolo_fx_save'] ) ) {
		return;
	}

	if ( ! check_admin_referer( 'fancoolo_fx_save_action', 'fancoolo_fx_nonce' ) ) {
		return;
	}

	if ( ! current_user_can( 'edit_theme_options' ) ) {
		return;
	}

	$content = isset( $_POST['fancoolo_fx_code'] ) ? wp_unslash( $_POST['fancoolo_fx_code'] ) : '';

	$upload_dir = wp_upload_dir();
	$dir        = $upload_dir['basedir'] . '/fancoolo-fx';

	if ( ! file_exists( $dir ) ) {
		wp_mkdir_p( $dir );
	}

	$file = $dir . '/custom.js';
	file_put_contents( $file, $content );

	add_settings_error(
		'fancoolo_fx',
		'fancoolo_fx_saved',
		'Custom JavaScript saved.',
		'success'
	);
}
add_action( 'admin_init', 'fancoolo_fx_handle_save' );

/**
 * ─── Admin: Render the settings page ────────────────────────────────
 */
function fancoolo_fx_render_admin_page() {
	$custom_file = fancoolo_fx_get_custom_file_path();
	$content     = file_exists( $custom_file ) ? file_get_contents( $custom_file ) : '';

	settings_errors( 'fancoolo_fx' );
	?>
	<div class="wrap">
		<h1>Fancoolo FX</h1>
		<p>
			GSAP animation wrapper is active. Add <code>.fx-*</code> classes to blocks in Gutenberg
			and they will animate automatically.
		</p>

		<hr>

		<h2>Custom JavaScript</h2>
		<p>
			Use this editor to add custom animation sequences, override defaults, or configure
			<code>__FX_CONFIG__</code>. This code loads after fx.js on the frontend.
			Leave empty to use defaults only.
		</p>

		<form method="post">
			<?php wp_nonce_field( 'fancoolo_fx_save_action', 'fancoolo_fx_nonce' ); ?>
			<textarea
				id="fancoolo-fx-editor"
				name="fancoolo_fx_code"
				rows="20"
				style="width: 100%; font-family: monospace;"
			><?php echo esc_textarea( $content ); ?></textarea>
			<p class="submit">
				<input
					type="submit"
					name="fancoolo_fx_save"
					class="button button-primary"
					value="Save Changes"
				>
			</p>
		</form>

		<hr>

		<h2>Examples</h2>
		<p>Copy any of these into the editor above and hit Save.</p>

		<h3 style="margin-top: 1.5em;">Auto-animate by tag (zero classes needed)</h3>
		<pre style="background: #23282d; color: #eee; padding: 16px; border-radius: 4px; max-width: 700px; overflow-x: auto;"><code>// Every heading, paragraph, and image inside sections
// animates automatically — no classes needed in Gutenberg
FX.config.tagMap = {
    'h1,h2,h3,h4,h5,h6': 'textReveal',
    'p,blockquote':       'textReveal',
    'img,video':          'reveal',
};
FX.config.sectionSelector = 'section, .wp-block-group';
FX.init();</code></pre>

		<h3 style="margin-top: 1.5em;">Change scroll trigger position</h3>
		<pre style="background: #23282d; color: #eee; padding: 16px; border-radius: 4px; max-width: 700px; overflow-x: auto;"><code>// Trigger animations when elements reach the center of the viewport
// instead of the default 85% (near the bottom)
FX.config.scrollStart = 'top center';
FX.init();</code></pre>

		<h3 style="margin-top: 1.5em;">Replay animations on re-scroll</h3>
		<pre style="background: #23282d; color: #eee; padding: 16px; border-radius: 4px; max-width: 700px; overflow-x: auto;"><code>// Animations replay every time the element enters the viewport
// instead of playing once
FX.config.scrollOnce = false;
FX.init();</code></pre>

		<h3 style="margin-top: 1.5em;">Compound sequence (JS API)</h3>
		<pre style="background: #23282d; color: #eee; padding: 16px; border-radius: 4px; max-width: 700px; overflow-x: auto;"><code>// Orchestrate multiple animations with specific timing
document.addEventListener('DOMContentLoaded', function () {
    var hero = document.querySelector('.wp-block-cover');
    if (!hero) return;

    FX.scaleIn(hero, {
        trigger: 'scroll',
        scrollTrigger: { trigger: hero }
    });

    var heading = hero.querySelector('h2');
    if (heading) {
        FX.textReveal(heading, {
            trigger: 'scroll',
            delay: 0.2,
            scrollTrigger: { trigger: hero }
        });
    }
});</code></pre>

		<h3 style="margin-top: 1.5em;">Available JS API functions</h3>
		<table class="widefat fixed striped" style="max-width: 700px;">
			<thead>
				<tr>
					<th>Function</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>FX.textReveal(el, opts)</code></td>
					<td>Split text lines, masked reveal upward</td>
				</tr>
				<tr>
					<td><code>FX.reveal(el, opts)</code></td>
					<td>Slide up with fade</td>
				</tr>
				<tr>
					<td><code>FX.spinReveal(el, opts)</code></td>
					<td>Rotate and scale in</td>
				</tr>
				<tr>
					<td><code>FX.bgReveal(el, opts)</code></td>
					<td>Background slide up</td>
				</tr>
				<tr>
					<td><code>FX.scaleIn(el, opts)</code></td>
					<td>Scale up with fade</td>
				</tr>
				<tr>
					<td><code>FX.init()</code></td>
					<td>Re-scan DOM (call after changing config)</td>
				</tr>
			</tbody>
		</table>

		<h3 style="margin-top: 1.5em;">Config options</h3>
		<table class="widefat fixed striped" style="max-width: 700px;">
			<thead>
				<tr>
					<th>Option</th>
					<th>Default</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>FX.config.sectionSelector</code></td>
					<td><code>'section'</code></td>
					<td>Containers for bare-class and tagMap triggering</td>
				</tr>
				<tr>
					<td><code>FX.config.scrollStart</code></td>
					<td><code>'top 85%'</code></td>
					<td>When scroll animations trigger</td>
				</tr>
				<tr>
					<td><code>FX.config.scrollOnce</code></td>
					<td><code>true</code></td>
					<td>Play once or replay on every scroll</td>
				</tr>
				<tr>
					<td><code>FX.config.tagMap</code></td>
					<td><code>null</code></td>
					<td>Auto-animate by tag name (no classes needed)</td>
				</tr>
			</tbody>
		</table>

		<p style="margin-top: 2em;">
			<a href="https://krstivoja.github.io/gsap-animations-template/documentation/" target="_blank">
				Full Documentation &rarr;
			</a>
		</p>
	</div>
	<?php
}
