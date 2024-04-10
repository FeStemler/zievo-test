<?php
// Incluir o arquivo de funções
include("functions.php");

// Verificar o tipo de requisição
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Decodificar os dados do corpo da requisição como JSON
    $requestData = json_decode(file_get_contents("php://input"), true);
    
    // Verificar se os parâmetros necessários estão presentes
    if (isset($requestData['name']) && isset($requestData['tax_rate'])) {
        // Chamar a função para cadastrar o tipo de produto
        $tipoProdutoId = cadastrarTipoProduto($requestData['name'], $requestData['tax_rate']);
        
        // Verificar se o cadastro foi bem-sucedido
        if ($tipoProdutoId) {
            // Retornar uma resposta de sucesso com o ID do tipo de produto cadastrado
            $response = array("success" => true, "tipo_produto_id" => $tipoProdutoId);
            echo json_encode($response);
        } else {
            // Retornar uma mensagem de erro se o cadastro falhar
            $response = array("success" => false, "message" => "Erro ao cadastrar tipo de produto");
            echo json_encode($response);
        }
    } else {
        // Retornar uma mensagem de erro se os parâmetros estiverem ausentes
        $response = array("success" => false, "message" => "Parâmetros insuficientes para cadastrar tipo de produto");
        echo json_encode($response);
    }
} elseif ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Verificar se é uma requisição GET para obter todos os tipos de produtos
    $tiposProdutos = obterTodosTiposProdutos();
    
    // Retornar os tipos de produtos em formato JSON
    echo json_encode($tiposProdutos);
} else {
    // Retornar uma mensagem de erro se o método da requisição não for suportado
    $response = array("success" => false, "message" => "Método de requisição não suportado");
    echo json_encode($response);
}
?>
