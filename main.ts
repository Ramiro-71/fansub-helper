import { App, Plugin, Modal, TextComponent, ButtonComponent, DropdownComponent, TFolder } from "obsidian";

export default class FansubPlugin extends Plugin {
	onload() {
		// Agregamos el botón a la barra lateral izquierda
		this.addRibbonIcon("plus", "Fansub Plugin", () => {
			new FansubModal(this.app).open();
		});
	}
}

class FansubModal extends Modal {
	titleField: TextComponent;
	authorField: TextComponent;
	totalPagesField: TextComponent;
	folderDropdown: DropdownComponent;
	selectedFolder: string = ""; // Valor inicial vacío

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;

		// Añadimos un estilo básico para la disposición de los elementos
		contentEl.style.display = "flex";
		contentEl.style.flexDirection = "column";
		contentEl.style.gap = "20px"; // Mayor espaciado entre filas

		// Título del modal
		contentEl.createEl("h2", { text: "Create new Fansub Note" });

		// Campo para el título (etiqueta a la izquierda, input a la derecha)
		this.createLabeledInput(contentEl, "Title", (input) => {
			this.titleField = input;
			this.titleField.setPlaceholder("Enter title");
		});

		// Campo para el autor
		this.createLabeledInput(contentEl, "Author", (input) => {
			this.authorField = input;
			this.authorField.setPlaceholder("Enter author");
		});

		// Campo para el total de páginas
		this.createLabeledInput(contentEl, "Total Pages", (input) => {
			this.totalPagesField = input;
			this.totalPagesField.setPlaceholder("Enter total pages");
		});

		// Desplegable para elegir la carpeta
		const folderContainer = contentEl.createDiv();
		folderContainer.style.display = "flex";
		folderContainer.style.justifyContent = "space-between";  // Alineación correcta
		folderContainer.style.alignItems = "center";  // Alineación vertical
		folderContainer.style.width = "100%";  // Ancho del contenedor

		const folderLabel = folderContainer.createEl('label', { text: 'Choose folder' });
		folderLabel.style.flex = "1";  // Tamaño de la etiqueta igual a los otros campos

		const dropdownWrapper = folderContainer.createDiv();
		dropdownWrapper.style.flex = "2";  // Aseguramos que el dropdown tenga el mismo espacio que los inputs

		this.folderDropdown = new DropdownComponent(dropdownWrapper);
		this.populateFolders();

		// Botón para crear la nota, alineado a la derecha
		const buttonContainer = contentEl.createDiv();
		buttonContainer.style.display = "flex";
		buttonContainer.style.justifyContent = "flex-end"; // Asegura que el botón esté en la parte inferior derecha

		const createButton = new ButtonComponent(buttonContainer);
		createButton.setButtonText("Create")
			.onClick(() => {
				this.createNote();
			});

		// Asegúrate de que el botón se muestre correctamente
		buttonContainer.appendChild(createButton.buttonEl);
	}

	// Función para poblar el desplegable con las carpetas del vault
	populateFolders() {
		const folders = this.getAllFolders();
		
		// Agregamos un valor predeterminado para asegurarnos de que siempre haya una opción
		if (folders.length === 0) {
			this.folderDropdown.addOption("root", "/"); // Opción por defecto si no hay carpetas
		} else {
			folders.forEach((folder) => {
				this.folderDropdown.addOption(folder.path, folder.path);
			});
		}

		this.folderDropdown.onChange((value) => {
			this.selectedFolder = value;
		});

		// Establecemos un valor por defecto para el dropdown
		if (folders.length > 0) {
			this.selectedFolder = folders[0].path; // Establece el primer valor como predeterminado
			this.folderDropdown.setValue(folders[0].path);
		}
	}

	// Función para obtener todas las carpetas del vault
	getAllFolders(): TFolder[] {
		const folders: TFolder[] = [];
		const rootFolder = this.app.vault.getRoot(); // Usamos this.app.vault en lugar de Vault directamente
		this.app.vault.getAllLoadedFiles().forEach((file) => {
			if (file instanceof TFolder) {
				folders.push(file);
			}
		});
		return folders;
	}

	createLabeledInput(
		container: HTMLElement,
		labelText: string,
		callback: (input: TextComponent) => void
	) {
		const inputRow = container.createDiv();
		inputRow.style.display = "flex";
		inputRow.style.justifyContent = "space-between"; // Etiqueta a la izquierda, input a la derecha
		inputRow.style.alignItems = "center";

		// Creamos la etiqueta
		const label = inputRow.createEl("label", { text: labelText });
		label.style.flex = "1"; // Deja espacio suficiente para el input

		// Creamos el input de texto
		const inputContainer = inputRow.createDiv();
		inputContainer.style.flex = "2"; // Asegura que el input tenga más espacio
		const input = new TextComponent(inputContainer);
		callback(input); // Llamamos al callback para setear el input
	}

	createNote() {
		const title = this.titleField.getValue();
		const author = this.authorField.getValue();
		const totalPages = parseInt(this.totalPagesField.getValue());

		// Verificamos que el número de páginas sea válido
		if (isNaN(totalPages) || totalPages <= 0) {
			new Notice("Total Pages must be greater than 0");
			return;
		}

		// Generamos el contenido de la nota con la numeración de páginas y tags en formato YAML correcto
		let content = `---\ntags:\n  - translation\ntitle: ${title}\ntranslatedTitle: Empty\nauthor: ${author}\n---\n`;

		for (let i = 1; i <= totalPages; i++) {
			content += `## Pag ${i}\n\n`;
		}

		// Verificamos que se haya seleccionado una carpeta y guardamos la nota en esa ruta
		const folderPath = this.selectedFolder ? `${this.selectedFolder}/` : '';
		const filePath = `${folderPath}${title}.md`;

		// Lógica para crear la nota
		this.app.vault.create(filePath, content).then(() => {
			// Abrir la nota recién creada
			this.app.workspace.openLinkText(title, "", true);
		});

		// Cerrar el modal después de crear la nota
		this.close();
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}
