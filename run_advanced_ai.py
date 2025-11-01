import sys
import argparse
import json

def run_stable_diffusion(prompt, output_path):
    # Use ai_adapter when present; otherwise fallback to a dry-run placeholder file.
    try:
        from scripts.adapters import ai_adapter
    except Exception:
        try:
            import adapters.ai_adapter as ai_adapter
        except Exception:
            ai_adapter = None

    if ai_adapter:
        return ai_adapter.run_image_task('stable-diffusion', prompt, output_path)

    print(f"[QMOI dry-run] Generating image for prompt: {prompt}")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f"Dry-run image for: {prompt}")
    return output_path

def run_stylegan(prompt, output_path):
    try:
        from scripts.adapters import ai_adapter
    except Exception:
        try:
            import adapters.ai_adapter as ai_adapter
        except Exception:
            ai_adapter = None

    if ai_adapter:
        return ai_adapter.run_image_task('stylegan', prompt, output_path)

    print(f"[QMOI dry-run] Generating StyleGAN image for: {prompt}")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f"Dry-run StyleGAN image for: {prompt}")
    return output_path

def run_animatediff(prompt, output_path):
    try:
        from scripts.adapters import ai_adapter
    except Exception:
        try:
            import adapters.ai_adapter as ai_adapter
        except Exception:
            ai_adapter = None

    if ai_adapter:
        return ai_adapter.run_image_task('animatediff', prompt, output_path)

    print(f"[QMOI dry-run] Generating AnimateDiff animation for: {prompt}")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f"Dry-run AnimateDiff animation for: {prompt}")
    return output_path

def main():
    parser = argparse.ArgumentParser(description='Run advanced AI/ML tasks')
    parser.add_argument('--type', type=str, required=True, help='Type of AI/ML task (stable-diffusion, stylegan, animatediff)')
    parser.add_argument('--prompt', type=str, required=True, help='Prompt for generation')
    parser.add_argument('--output', type=str, required=True, help='Output file path')
    args = parser.parse_args()

    if args.type == 'stable-diffusion':
        result = run_stable_diffusion(args.prompt, args.output)
    elif args.type == 'stylegan':
        result = run_stylegan(args.prompt, args.output)
    elif args.type == 'animatediff':
        result = run_animatediff(args.prompt, args.output)
    else:
        print('Unknown type')
        sys.exit(1)
    print(json.dumps({'status': 'success', 'output': result}))

if __name__ == '__main__':
    main()
