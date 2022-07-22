/* responsible for providing whatever list, by whatever logic
		currently static list
		can be adjusted to search for globs, file-names, etc
*/
const list = ['./uitest.example.js', './example-component.uitest.js'];

export async function uitestList() {
	return list;
}
