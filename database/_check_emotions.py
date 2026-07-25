with open(r'd:\Projek\diajar\database\database.sql', 'r', encoding='utf-8') as f:
    orig_lines = f.readlines()

with open(r'd:\Projek\diajar\database\dummy_seed.sql', 'r', encoding='utf-8') as f:
    seed_lines = f.readlines()

def extract_emotions_manual(line):
    """Manual extraction: find the emotions value by counting SQL value fields."""
    # For reflections table: id, student_id, title, content, comprehension_level, emotions, teacher_comment, created_at, updated_at
    # emotions is the 6th field (index 5)
    # Walk through the line parsing SQL values
    # Start after the opening (
    start = line.find('(')
    if start < 0:
        return None
    
    pos = start + 1
    field_idx = 0
    
    while pos < len(line) and field_idx < 5:  # Skip first 5 fields to get to emotions
        # Skip whitespace
        while pos < len(line) and line[pos] == ' ':
            pos += 1
        
        if line[pos] == "'":
            # String field - find closing unescaped quote
            pos += 1
            while pos < len(line):
                if line[pos] == '\\':
                    pos += 2  # Skip escaped char
                    continue
                if line[pos] == "'":
                    pos += 1
                    break
                pos += 1
        elif line[pos:pos+4] == 'NULL':
            pos += 4
        else:
            # Number or other literal
            while pos < len(line) and line[pos] not in (',', ')'):
                pos += 1
        
        # Skip comma and space
        if pos < len(line) and line[pos] == ',':
            pos += 1
            while pos < len(line) and line[pos] == ' ':
                pos += 1
        field_idx += 1
    
    # Now pos should be at the start of the emotions field
    if pos < len(line) and line[pos] == "'":
        # Extract the string value including quotes
        end = pos + 1
        while end < len(line):
            if line[end] == '\\':
                end += 2
                continue
            if line[end] == "'":
                end += 1
                break
            end += 1
        return line[pos:end]
    
    return None

# Test with original lines 1140, 1142
print("=== ORIGINAL ===")
for i in [1139, 1140, 1141, 1143]:
    val = extract_emotions_manual(orig_lines[i])
    print(f"  Line {i+1}: {val}")

print()
print("=== MY SEED ===")
for i in [445, 446, 447, 448, 449, 450, 451]:
    val = extract_emotions_manual(seed_lines[i])
    print(f"  Line {i+1}: {val}")

print()
# Direct comparison
orig_with_emoji = extract_emotions_manual(orig_lines[1141])
seed_with_emoji = extract_emotions_manual(seed_lines[445])
orig_empty = extract_emotions_manual(orig_lines[1139])
seed_empty = extract_emotions_manual(seed_lines[448])

print(f"ORIG emoji:  {repr(orig_with_emoji)}")
print(f"SEED emoji:  {repr(seed_with_emoji)}")
print(f"Emoji match: {orig_with_emoji == seed_with_emoji}")
print()
print(f"ORIG empty:  {repr(orig_empty)}")
print(f"SEED empty:  {repr(seed_empty)}")
print(f"Empty match: {orig_empty == seed_empty}")
